-- =====================================================================
-- Cha de Fraldas do Felipe - schema do banco (Supabase / Postgres)
-- Rode este arquivo inteiro no SQL Editor do Supabase.
-- Pode ser executado novamente com seguranca (idempotente).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------
create table if not exists public.gifts (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null check (char_length(btrim(title)) between 1 and 120),
  category           text not null default 'Outros' check (char_length(btrim(category)) between 1 and 60),
  total_quantity     integer not null default 1 check (total_quantity >= 0),
  available_quantity integer not null default 1,
  sort_order         integer not null default 0,
  created_at         timestamptz not null default now(),
  constraint gifts_available_range check (available_quantity between 0 and total_quantity)
);

create table if not exists public.reservations (
  id          uuid primary key default gen_random_uuid(),
  gift_id     uuid not null references public.gifts (id) on delete cascade,
  guest_name  text not null check (char_length(guest_name) between 1 and 100),
  guest_phone text check (guest_phone is null or char_length(guest_phone) <= 30),
  message     text check (message is null or char_length(message) <= 500),
  created_at  timestamptz not null default now()
);

create index if not exists reservations_gift_id_idx on public.reservations (gift_id);
create index if not exists gifts_category_sort_idx on public.gifts (category, sort_order);

-- ---------------------------------------------------------------------
-- Ao alterar total_quantity, recalcula available_quantity preservando
-- a quantidade ja reservada. Impede reduzir abaixo do ja escolhido.
-- ---------------------------------------------------------------------
create or replace function public.gifts_adjust_available()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_reserved integer;
begin
  if new.total_quantity is distinct from old.total_quantity then
    v_reserved := old.total_quantity - old.available_quantity;
    if new.total_quantity < v_reserved then
      raise exception 'TOTAL_BELOW_RESERVED'
        using errcode = 'P0001',
              detail = format('Ja existem %s reserva(s) para este item.', v_reserved);
    end if;
    new.available_quantity := new.total_quantity - v_reserved;
  end if;
  return new;
end;
$$;

drop trigger if exists gifts_adjust_available on public.gifts;
create trigger gifts_adjust_available
  before update of total_quantity on public.gifts
  for each row execute function public.gifts_adjust_available();

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.gifts enable row level security;
alter table public.reservations enable row level security;

drop policy if exists "gifts_select_public" on public.gifts;
create policy "gifts_select_public" on public.gifts
  for select to anon, authenticated using (true);

drop policy if exists "gifts_insert_auth" on public.gifts;
create policy "gifts_insert_auth" on public.gifts
  for insert to authenticated with check (true);

drop policy if exists "gifts_update_auth" on public.gifts;
create policy "gifts_update_auth" on public.gifts
  for update to authenticated using (true) with check (true);

drop policy if exists "gifts_delete_auth" on public.gifts;
create policy "gifts_delete_auth" on public.gifts
  for delete to authenticated using (true);

-- reservations: anon nao tem nenhuma policy (nao le nem escreve diretamente).
-- Inserts acontecem apenas via funcao reserve_gift (security definer).
drop policy if exists "reservations_select_auth" on public.reservations;
create policy "reservations_select_auth" on public.reservations
  for select to authenticated using (true);

drop policy if exists "reservations_delete_auth" on public.reservations;
create policy "reservations_delete_auth" on public.reservations
  for delete to authenticated using (true);

-- Privilegios de tabela (defesa em profundidade alem do RLS)
revoke all on public.gifts from anon;
revoke all on public.reservations from anon;
grant select on public.gifts to anon;
grant select, insert, update, delete on public.gifts to authenticated;
grant select, delete on public.reservations to authenticated;

-- ---------------------------------------------------------------------
-- RPC: reserve_gift (publica)
-- ---------------------------------------------------------------------
create or replace function public.reserve_gift(
  p_gift_id     uuid,
  p_guest_name  text,
  p_guest_phone text default null,
  p_message     text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_name  text := btrim(coalesce(p_guest_name, ''));
  v_phone text := nullif(btrim(coalesce(p_guest_phone, '')), '');
  v_msg   text := nullif(btrim(coalesce(p_message, '')), '');
  v_id    uuid;
begin
  if char_length(v_name) < 1 or char_length(v_name) > 100 then
    raise exception 'INVALID_NAME' using errcode = '22023';
  end if;
  if v_phone is not null and char_length(v_phone) > 30 then
    raise exception 'INVALID_PHONE' using errcode = '22023';
  end if;
  if v_msg is not null and char_length(v_msg) > 500 then
    raise exception 'INVALID_MESSAGE' using errcode = '22023';
  end if;

  -- Decremento atomico: so atualiza se ainda houver unidade disponivel
  update public.gifts
     set available_quantity = available_quantity - 1
   where id = p_gift_id
     and available_quantity > 0;

  if not found then
    raise exception 'GIFT_UNAVAILABLE' using errcode = 'P0001';
  end if;

  insert into public.reservations (gift_id, guest_name, guest_phone, message)
  values (p_gift_id, v_name, v_phone, v_msg)
  returning id into v_id;

  return v_id;
end;
$$;

-- ---------------------------------------------------------------------
-- RPC: cancel_reservation (somente organizador autenticado)
-- ---------------------------------------------------------------------
create or replace function public.cancel_reservation(p_reservation_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_gift_id uuid;
begin
  if coalesce(auth.role(), '') <> 'authenticated' then
    raise exception 'NOT_AUTHORIZED' using errcode = '42501';
  end if;

  delete from public.reservations
   where id = p_reservation_id
  returning gift_id into v_gift_id;

  if v_gift_id is null then
    raise exception 'RESERVATION_NOT_FOUND' using errcode = 'P0002';
  end if;

  update public.gifts
     set available_quantity = least(total_quantity, available_quantity + 1)
   where id = v_gift_id;
end;
$$;

revoke all on function public.reserve_gift(uuid, text, text, text) from public;
revoke all on function public.cancel_reservation(uuid) from public;
revoke all on function public.gifts_adjust_available() from public;
grant execute on function public.reserve_gift(uuid, text, text, text) to anon, authenticated;
grant execute on function public.cancel_reservation(uuid) to authenticated;

-- ---------------------------------------------------------------------
-- Realtime: publica mudancas da tabela gifts
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
     where pubname = 'supabase_realtime'
       and schemaname = 'public'
       and tablename = 'gifts'
  ) then
    alter publication supabase_realtime add table public.gifts;
  end if;
end;
$$;
