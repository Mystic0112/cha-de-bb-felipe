-- =====================================================================
-- Sugestoes iniciais da lista de presentes.
-- Rode depois do schema.sql. Ajuste quantidades a vontade.
-- Executar de novo NAO duplica itens com o mesmo titulo.
-- =====================================================================

insert into public.gifts (title, category, total_quantity, available_quantity, sort_order)
select v.title, v.category, v.qty, v.qty, v.sort_order
from (values
  ('Fralda tamanho RN (pacote)',            'Fraldas',  3, 10),
  ('Fralda tamanho P (pacote)',             'Fraldas',  8, 20),
  ('Fralda tamanho M (pacote)',             'Fraldas', 12, 30),
  ('Fralda tamanho G (pacote)',             'Fraldas', 12, 40),
  ('Fralda tamanho XG (pacote)',            'Fraldas',  8, 50),
  ('Lenços umedecidos (pacote)',            'Higiene', 10, 10),
  ('Algodão (pacote)',                      'Higiene',  4, 20),
  ('Hastes flexíveis (cotonete)',           'Higiene',  2, 30),
  ('Sabonete líquido infantil',             'Higiene',  3, 40),
  ('Shampoo infantil',                      'Higiene',  2, 50),
  ('Pomada para assaduras',                 'Cuidados', 4, 10),
  ('Óleo/loção hidratante infantil',        'Cuidados', 2, 20),
  ('Álcool 70%',                            'Cuidados', 2, 30),
  ('Toalhinhas de boca',                    'Cuidados', 3, 40)
) as v(title, category, qty, sort_order)
where not exists (select 1 from public.gifts g where g.title = v.title);
