delete from dat_intentions where idf_intention = 1011;
delete from dat_relations where idf_intention = 1011;
delete from dat_expressions where idf_expression in (1011);

insert into dat_intentions (boo_exact, idf_intention, txt_intention) values
(false, 1011, 'hola'),
(false, 1011, 'como estas'),
(false, 1011, 'que tal');

insert into dat_relations (boo_dependency, idf_intention, txt_function) values
(false, 1011, 'flow_hello');

insert into dat_expressions (idf_expression, num_offset, txt_expression) values
(1011, 1, 'Hola%0! soy BeeBee, tu asistente virtual, ¿en qué te ayudo?'),
(1011, 1, 'Hola%0, ¿cómo estás? Soy BeeBee, ¿puedo ayudarte en algo?'),
(1011, 1, '¿Cómo estas%0? ¿Cómo puedo ayudarte en el día de hoy?'),
(1011, 1, '¿Todo bien%0? Mi nombre es BeeBee, y estoy aquí para ayudarte'),
(1011, 1, '¿Qué puedo hacer por ti hoy%0? Recuerda que estoy acá para ayudarte'),
(1011, 1, '¿Cómo estás%0? Soy BeeBee, tu asistente virtual. ¿Qué puedo hacer por ti?'),
(1011, 1, '¿Cómo puedo ayudarte%0? Lo que necesites no dudes en preguntarme'),
(1011, 1, 'Hola, soy BeeBee, tu asistente virtual. ¿Qué puedo hacer por ti%0?'),
(1011, 1, '¿Qué necesitas%0? Soy BeeBee, tu asistente virtual. Estoy aquí para ayudarte.'),
(1011, 1, 'Soy BeeBee, tu asistente virtual. No dudes en preguntarme lo que quieras%0, estoy a tu disposición');