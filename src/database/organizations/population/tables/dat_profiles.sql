truncate dat_profiles cascade;

insert into dat_profiles (idf_profile, boo_collaborator, txt_icon, txt_profile) values
(0, false, null, 'BeeHappy'),
(11, true, 'profile11', 'Asistente Virtual'),
(12, true, 'profile12', 'Asistente Virtual'),
(21, true, 'profile21', 'Director Ejecutivo'),
(22, true, 'profile22', 'Director de Operaciones'),
(31, true, 'profile31', 'Contabilidad y Finanzas'),
(32, true, 'profile32', 'Administración y Operaciones'),
(33, true, 'profile33', 'Desarrollo e Innovación'),
(41, true, 'profile41', 'Soporte Jurídico'),
(42, true, 'profile42', 'Prevención y Seguridad'),
(51, true, 'profile51', 'Ejecutivo Operador');