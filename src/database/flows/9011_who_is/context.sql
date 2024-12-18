delete from dat_intentions where idf_intention = 9011;
delete from dat_relations where idf_intention = 9011;
delete from dat_expressions where idf_expression in (9011, 9012, 9013, 9014, 9015, 9016);

insert into dat_intentions (boo_exact, idf_intention, txt_intention) values
(false, 9011, '/whois');

insert into dat_relations (boo_dependency, idf_intention, txt_function) values
(false, 9011, 'flow_who_is');

insert into dat_expressions (idf_expression, num_offset, txt_expression) values
(9011, 1, 'El teléfono por el que me consultas lo tengo registrado como:'),
(9011, 2, 'Nombre: %1'),
(9011, 3, 'Correo electrónico: %2'),
(9011, 4, 'Estado: %3'),

(9012, 1, 'El teléfono por el que me consultas no lo tengo registrado.'),

(9013, 1, 'El teléfono por el que me consultas no corresponde a un teléfono válido.'),

(9014, 1, 'El correo por el que me consultas lo tengo registrado como:'),
(9014, 2, 'Nombre: %1'),
(9014, 3, 'Teléfono: %2'),
(9014, 4, 'Estado: %3'),

(9015, 1, 'El correo por el que me consultas no lo tengo registrado.'),

(9016, 1, 'El dato el que me proporcionas no corresponde a un teléfono ni a un correo válido.');