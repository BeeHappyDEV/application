delete from dat_intentions where idf_intention = 9031;
delete from dat_relations where idf_intention = 9031;
delete from dat_expressions where idf_expression in (9031, 9032, 9033, 9034, 9035, 9036);

insert into dat_intentions (boo_exact, idf_intention, txt_intention) values
(false, 9031, '/adduser');

insert into dat_relations (boo_dependency, idf_intention, txt_function) values
(false, 9031, 'flow_add_user');

insert into dat_expressions (idf_expression, num_offset, txt_expression) values
(9031, 1, 'El teléfono que intentas agregar lo tengo registrado como:'),
(9031, 2, 'Nombre: %1'),
(9031, 3, 'Correo electrónico: %2'),
(9031, 4, 'Estado: %3'),

(9032, 1, 'El teléfono por el que me consultas no lo tengo registrado.'),

(9033, 1, 'El teléfono por el que me consultas no corresponde a un teléfono válido.'),

(9034, 1, 'El correo por el que me consultas lo tengo registrado como:'),
(9034, 2, 'Nombre: %1'),
(9034, 3, 'Teléfono: %2'),
(9034, 4, 'Estado: %3'),

(9035, 1, 'El correo por el que me consultas no lo tengo registrado.'),

(9036, 1, 'El dato el que me proporcionas no corresponde a un teléfono ni a un correo válido.');