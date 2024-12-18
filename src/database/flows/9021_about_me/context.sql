delete from dat_intentions where idf_intention = 9021;
delete from dat_relations where idf_intention = 9021;
delete from dat_expressions where idf_expression in (9021);

insert into dat_intentions (boo_exact, idf_intention, txt_intention) values
(false, 9021, '/aboutme');

insert into dat_relations (boo_dependency, idf_intention, txt_function) values
(false, 9021, 'flow_about_me');

insert into dat_expressions (idf_expression, num_offset, txt_expression) values
(9021, 1, 'BeeBee® Virtual Asistance'),
(9021, 2, 'Copyright © 2024 by BeeHappy.AI®'),
(9021, 3, 'Version: %1'),
(9021, 4, 'Status: %2');