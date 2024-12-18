delete from dat_intentions where idf_intention = 1031;
delete from dat_relations where idf_intention = 1031;
delete from dat_expressions where idf_expression in (1031);

insert into dat_intentions (boo_exact, idf_intention, txt_intention) values
(false, 1031, 'adios'),
(false, 1031, 'agradecida'),
(false, 1031, 'agradecido'),
(false, 1031, 'gracias'),
(false, 1031, 'muy amable');

insert into dat_relations (boo_dependency, idf_intention, txt_function) values
(false, 1031, 'flow_thanks');

insert into dat_expressions (idf_expression, num_offset, txt_expression) values
(1031, 1, '¡Para eso estamos%0! Que tengas un buen dia.'),
(1031, 1, 'Espero haberte ayudado%0. Disfruta lo que queda del dia.'),
(1031, 1, '¡Que tengas un buen dia%0! Espero haberte ayudado.'),
(1031, 1, 'Me alegra haberte ayudado%0. ¡Que estés muy bien!'),
(1031, 1, '¡Gracias por tus consultas%0! Que estés bien.'),
(1031, 1, 'Si tienes alguna otra consulta%0, aquí estaré.'),
(1031, 1, 'Estoy aquí para servirte%0, que tengas un bonito dia.'),
(1031, 1, 'Espero que esto te haya ayudado%0, ten un bonito día.'),
(1031, 1, 'Gracias por tu paciencia%0, estoy aquí para ayudarte.'),
(1031, 1, 'Gracias por preguntarme%0, espero haberte ayudado.');