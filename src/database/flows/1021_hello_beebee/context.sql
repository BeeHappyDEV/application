delete from dat_intentions where idf_intention = 1021;
delete from dat_relations where idf_intention = 1021;
delete from dat_expressions where idf_expression in (1021);

insert into dat_intentions (boo_exact, idf_intention, txt_intention) values
(true, 1021, 'beebee'),
(true, 1021, 'hola beebee');

insert into dat_relations (boo_dependency, idf_intention, txt_function) values
(false, 1021, 'flow_hello_beebee');

insert into dat_expressions (idf_expression, num_offset, txt_expression) values
(1021, 1, '¡Si%0! Asi me llamo, en que te puedo ayudar?'),
(1021, 1, '¡Esa soy yo! Estoy acá para ayudarte. Pregúntame%0 con confianza.'),
(1021, 1, '¡Me gusta que me llamen por mi nombre! En que te ayudo%0?'),
(1021, 1, '¡Ese es mi nombre! ¿qué puedo hacer por ti%0?'),
(1021, 1, '¿Te gusta mi nombre%0?, ¿en qué puedo ayudarte?');