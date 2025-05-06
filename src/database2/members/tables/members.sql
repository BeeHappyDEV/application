drop table if exists members cascade;

create table if not exists members (
    idf_member     uuid primary key references entities (idf_entity) on delete cascade,
    boo_active     boolean not null default true,
    txt_first_name text not null,
    txt_last_name  text not null,
    txt_mail       text not null,
    txt_phone      text not null
) inherits (entities);

alter table members enable row level security;

comment on table members is 'mem';

with tabled_data as (
    select *
    from (values
        (true, 'BeeHappy', '', 'hola@beehappy.dev', '56977533622'),
        (true, 'BeeBee', '', 'hola@beehappy.dev', '56944244244'),
        (true, 'BeeJay', '', 'hola@beehappy.dev', '56944744744'),
        (true, 'Alexis', 'Bacian', 'alexis@beehappy.dev', '56944744744'),
        (true, 'Isabel', 'Gonzalez', 'isabelangelica@gmail.com', '56995995422')
    ) as data (boo_active, txt_first_name, txt_last_name, txt_mail, txt_phone)
),
entities_insert as (
    insert into entities
    select from generate_series (1, (select count (*) from tabled_data))
    returning idf_entity
),
matched_data as (
    select
        e.idf_entity,
        t.boo_active,
        t.txt_first_name,
        t.txt_last_name,
        t.txt_phone,
        t.txt_mail
    from (
        select
            row_number() over () as rn,
            boo_active,
            txt_first_name,
            txt_last_name,
            txt_phone,
            txt_mail
        from tabled_data
    ) t
    join (
        select
            row_number() over () as rn,
            idf_entity
        from entities_insert
    ) e on t.rn = e.rn
)
insert into members (
    idf_member,
    boo_active,
    txt_first_name,
    txt_last_name,
    txt_phone,
    txt_mail
)
select
    idf_entity,
    boo_active,
    txt_first_name,
    txt_last_name,
    txt_phone,
    txt_mail
from matched_data;