delete from dat_intentions where idf_intention in (9093);
delete from dat_relations where idf_intention in (9093);
delete from dat_expressions where idf_expression in (9093, 9094);

insert into dat_intentions (boo_exact, idf_intention, txt_intention) values
(false, 9093, '/updateidentifier');

insert into dat_relations (boo_dependency, idf_intention, txt_function) values
(false, 9093, 'flow_update_identifier');

insert into dat_expressions (idf_expression, num_offset, txt_expression) values
(9093, 1, 'Gracias, ya he registrado tu número; pregúntame con confianza.'),
(9093, 1, 'Tu número ha sido registrado con éxito. No dudes en preguntarme lo que necesites.'),
(9093, 1, 'Te he registrado en mi sistema. Ahora puedes preguntarme cualquier cosa.'),
(9093, 1, 'Gracias por proporcionarme tu información. Estoy aquí para ayudarte.'),
(9093, 1, 'Gracias por registrarte. Ahora puedes hacerme cualquier pregunta que tengas.'),

(9094, 1, 'Ya tengo tu número registrado en mi sistema.'),
(9094, 2, 'No necesitas compartírmelo de nuevo.');