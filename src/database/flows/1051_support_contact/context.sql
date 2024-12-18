delete from dat_intentions where idf_intention = 1051;
delete from dat_relations where idf_intention = 1051;
delete from dat_expressions where idf_expression in (1051);

insert into dat_intentions (boo_exact, idf_intention, txt_intention) values
(false, 1051, 'correo'),
(false, 1051, 'soporte');

insert into dat_relations (boo_dependency, idf_intention, txt_function) values
(false, 1051, 'flow_support_contact');

insert into dat_expressions (idf_expression, num_offset, txt_expression) values
(1051, 1, 'Hola%0, el correo de la plataforma de soporte es %1'),
(1051, 2, 'También puedes llamarnos al %2');