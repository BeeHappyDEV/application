drop table if exists members cascade;

create table if not exists members (
    idf_member     uuid primary key references registries (idf_registry) on delete cascade,
    boo_active     boolean not null default true,
    txt_first_name text not null,
    txt_last_name  text,
    txt_mail       text,
    txt_phone      text not null,
    txt_address    text,
    txt_location   text
) inherits (registries);

alter table members enable row level security;

comment on table members is 'mem';

with tabled_data as (
    select *
    from (values
        (true, 'BeeHappy', null, 'hola@beehappy.dev', '56977533622', 'Avenida Apoquindo 5950,<br>Las Condes', 'https://maps.app.goo.gl/xZBD8AerhrRa4yaHA'),
        (true, 'BeeBee', null, 'hola@beehappy.dev', '56944244244', null, 'https://maps.app.goo.gl/xZBD8AerhrRa4yaHA'),
        (true, 'BeeJay', null, 'hola@beehappy.dev', '56944744744', null, 'https://maps.app.goo.gl/xZBD8AerhrRa4yaHA'),
        (true, 'Alexis', 'Bacian', 'alexis@beehappy.dev', '56991220195', null, null),
        (true, 'Isabel', 'Gonzalez', 'isabelangelica@gmail.com', '56995995422', null, null)
    ) as data (boo_active, txt_first_name, txt_last_name, txt_mail, txt_phone, txt_address, txt_location)
),
registries_insert as (
    insert into registries
    select from generate_series (1, (select count (*) from tabled_data))
    returning idf_registry
),
matched_data as (
    select
        e.idf_registry,
        t.boo_active,
        t.txt_first_name,
        t.txt_last_name,
        t.txt_phone,
        t.txt_mail,
        t.txt_address,
        t.txt_location
    from (
        select
            row_number() over () as rn,
            boo_active,
            txt_first_name,
            txt_last_name,
            txt_phone,
            txt_mail,
            txt_address,
            txt_location
        from tabled_data
    ) t
    join (
        select
            row_number() over () as rn,
            idf_registry
        from registries_insert
    ) e on t.rn = e.rn
)
insert into members (
    idf_member,
    boo_active,
    txt_first_name,
    txt_last_name,
    txt_phone,
    txt_mail,
    txt_address,
    txt_location
)
select
    idf_registry,
    boo_active,
    txt_first_name,
    txt_last_name,
    txt_phone,
    txt_mail,
    txt_address,
    txt_location
from matched_data;