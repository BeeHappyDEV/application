delete from dat_intentions where idf_intention in (9091);
delete from dat_relations where idf_intention in (9091);
delete from dat_expressions where idf_expression in (9091);

insert into dat_intentions (boo_exact, idf_intention, txt_intention) values
(false, 9091, '/requireidentifier');

insert into dat_relations (boo_dependency, idf_intention, txt_function) values
(false, 9091, 'flow_require_identifier');

insert into dat_expressions (idf_expression, num_offset, txt_expression) values
(9091, 1, 'Para ayudarte necesito tu número de teléfono. ¿Puedes compartirmelo?'),
(9091, 1, '¿Me podrías proporcionar tu número de teléfono para poder seguir?'),
(9091, 1, 'Para poder brindarte un mejor servicio, necesito tu número de teléfono.'),
(9091, 1, 'Tu número de teléfono es necesario para que pueda ayudarte.'),
(9091, 1, 'Te agradecería mucho que me facilitaras tu número de teléfono.'),
(9091, 2, 'Dale al botón para compartir tu número de teléfono.'),
(9091, 2, 'Para compartir tu número, presiona el botón.'),
(9091, 2, 'Comparte tu número presionando el botón.');