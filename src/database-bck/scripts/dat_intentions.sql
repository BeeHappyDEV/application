truncate dat_intentions cascade;

insert into dat_intentions (boo_exact, idf_intention, txt_intention) values

(true, 1030, ''),
(false, 1030, 'ayuda'),
(false, 1030, 'ayude'),
(false, 1030, 'consulta'),
(false, 1030, 'contacta'),
(false, 1030, 'contacto'),
(false, 1030, 'duda'),
(false, 1030, 'opcion'),
(false, 1030, 'servicio')
;

/*
(false, 1050, null),

(false, 1060, null),



(false, 5010, 'incidente'),
(false, 5010, 'problema'),
(false, 5010, 'ticket'),

(true, 8010, '1'),
(true, 8020, '2'),
(true, 8030, '3'),
(true, 8040, '4'),
(true, 8050, '5'),
(true, 8060, '6'),
(true, 8070, '7'),
(true, 8080, '8'),
(true, 8090, '9'),

(true, 9010, 'about me'),
(true, 9020, 'maintenance')
;
*/