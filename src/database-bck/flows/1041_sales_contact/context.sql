delete from dat_intentions where idf_intention = 1041;
delete from dat_relations where idf_intention = 1041;
delete from dat_expressions where idf_expression in (1041);

insert into dat_intentions (boo_exact, idf_intention, txt_intention) values
(false, 1041, 'venta'),
(false, 1041, 'comercial');

insert into dat_relations (boo_dependency, idf_intention, txt_function) values
(false, 1041, 'flow_sales_contact');

insert into dat_expressions (idf_expression, num_offset, txt_expression) values
(1041, 1, 'Hola%0, el correo del área de ventas es %1'),
(1041, 2, 'También puedes llamarnos al %2');