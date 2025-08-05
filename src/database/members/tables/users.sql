drop table if exists members.users cascade;

create table if not exists members.users (
    idf_user       uuid primary key references framework.registries (idf_registry) on delete cascade,
    boo_active     boolean not null default true,
    txt_first_name text not null,
    txt_last_name  text,
    txt_mail       text,
    txt_phone      text not null,
    txt_address    text,
    txt_location   text
) inherits (framework.registries);

alter table members.users enable row level security;

comment on table members.users is 'usr';

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.users (idf_user, boo_active, txt_first_name, txt_last_name, txt_phone, txt_mail, txt_address, txt_location)
select idf_registry, true, 'BeeHappy', null, 'hola@beehappy.dev', '56977533622', 'Avenida Apoquindo 5950,<br>Las Condes', 'https://maps.app.goo.gl/xZBD8AerhrRa4yaHA'
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.users (idf_user, boo_active, txt_first_name, txt_last_name, txt_phone, txt_mail, txt_address, txt_location)
select idf_registry, true, 'BeeBee', null, 'hola@beehappy.dev', '56944244244', null, 'https://maps.app.goo.gl/xZBD8AerhrRa4yaHA'
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.users (idf_user, boo_active, txt_first_name, txt_last_name, txt_phone, txt_mail, txt_address, txt_location)
select idf_registry, true, 'BeeJay', null, 'hola@beehappy.dev', '56944744744', null, 'https://maps.app.goo.gl/xZBD8AerhrRa4yaHA'
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.users (idf_user, boo_active, txt_first_name, txt_last_name, txt_phone, txt_mail, txt_address, txt_location)
select idf_registry, true, 'Alexis', 'Bacian', 'alexis@beehappy.dev', '56991220195', null, null
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.users (idf_user, boo_active, txt_first_name, txt_last_name, txt_phone, txt_mail, txt_address, txt_location)
select idf_registry, true, 'Isabel', 'Gonzalez', 'isabelangelica@gmail.com', '56995995422', null, null
from new_registry;