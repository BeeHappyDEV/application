truncate dat_expressions cascade;

insert into dat_expressions (idf_expression, num_offset, txt_expression) values

(1030, 1, 'Hola%0, puedo ayudarte con esto:'),
(1030, 1, 'Hola%0, creo que podría asesorarte con:'),
(1030, 1, 'Sabes%0?, puedo ayudarte con esto:'),
(1030, 1, 'Tal vez%0, podria servirte esto:'),
(1030, 1, 'Hola%0, tal vez te interese:'),
(1030, 1, 'Tal vez%0, quieras saber sobre:'),
(1030, 1, 'Podría orientarte en esto%0:'),
(1030, 1, 'Puedo ofrecerte ayuda con esto%0:'),
(1030, 1, 'Tengo información sobre estos temas%0:'),
(1030, 1, 'Tal vez te interese saber sobre lo siguiente%0:'),


(1050, 1, 'Lamento no poder entenderte%0. Podria ayudarte con:'),
(1050, 1, 'Lo siento%0, no te entiendo. Tal vez te interese:'),
(1050, 1, 'No comprendo lo que me pides%0. Quizas quieras saber sobre:'),
(1050, 1, '¿Podrías proporcionarme más información%0? En una de esas quieras:'),
(1050, 1, '¿Podrías intentarlo de otra manera%0? Puedo ofrecerte:'),
(1050, 1, 'Trata de reformular tu solicitud%0, podría orientarte en:'),






(1060, 1, 'Ups!!! No te reconozco. Quizas quieras saber como:'),

(2010, 1, 'Hola%0, tu perfil de acceso es:'),

(5010, 1, 'Hola%0, el incidente que tienes abierto es:'),
(5010, 1, 'Hola%0, los incidentes que tienes abiertos son:' || chr (10) || '%1' || chr (10) || 'Para seleccionar una incidente ingresa: ```incidente codigo```'),

(5010, 1, 'Hola%0, los incidentes que tienes abiertos son:' || chr (10) || '%1' || chr (10) || 'Para seleccionar una incidente ingresa: ```incidente codigo```'),


(9020, 1, 'Hola%0, en estos momentos no puedo atenderte.' || chr (10) || 'Me encuentro en mantencion.' || chr (10) ||'Intentalo mas tarde, ok?')


;