delete from dat_intentions where idf_intention in (9092);
delete from dat_relations where idf_intention in (9092);
delete from dat_expressions where idf_expression in (9092);

insert into dat_intentions (boo_exact, idf_intention, txt_intention) values
(false, 9092, '/rejectidentifier');

insert into dat_relations (boo_dependency, idf_intention, txt_function) values
(false, 9092, 'flow_reject_identifier');

insert into dat_expressions (idf_expression, num_offset, txt_expression) values
(9092, 1, 'Este contacto no corresponde a tu número.'),
(9092, 2, 'Dale al botón para compartir tu número de teléfono.'),
(9092, 2, 'Para compartir tu número, presiona el botón.'),
(9092, 2, 'Comparte tu número presionando el botón.');