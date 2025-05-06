drop table if exists profiles cascade;

create table if not exists profiles (
    idf_profile        uuid primary key references entities (idf_entity) on delete cascade,
    boo_active         boolean default true,
    boo_internal       boolean default true,
    txt_code           text not null,
    txt_description_en text not null,
    txt_description_es text not null,
    txt_icon           text not null
) inherits (entities);

alter table profiles enable row level security;

comment on table profiles is 'prf';

with tabled_data as (
    select *
    from (values
        (true, true, 'BEE', 'Corporate Entity', 'Entidad Corporativa', 'profile_bee'),
        (true, true, 'AVA', 'Automated Virtual Assistant', 'Asistente Virtual Automatizado', 'profile_ava'),
        (true, true, 'CEO', 'Chief Operating Officer', 'Director Ejecutivo', 'profile_ceo'),
        (true, true, 'CMO', 'Chief Marketing Officer', 'Director de Marketing', 'profile_cmo'),
        (true, true, 'MKT', 'Marketing Assistant', 'Asistente de Marketing', 'profile_mkt'),
        (true, true, 'CFO', 'Chief Financial Officer', 'Director Financiero', 'profile_cfo'),
        (true, true, 'FIN', 'Finance Assistant', 'Asistente Financiero', 'profile_fin'),
        (true, true, 'CTO', 'Chief Technology Officer', 'Director de Tecnología', 'profile_cto'),
        (true, true, 'TEC', 'Tech Assistant', 'Asistente Técnico', 'profile_tec'),
        (true, true, 'CCO', 'Chief Communications Officer', 'Director de Comunicaciones', 'profile_cco'),
        (true, true, 'COM', 'Communications Assistant', 'Asistente de Comunicaciones', 'profile_com'),
        (true, true, 'COO', 'Chief Operating Officer', 'Director de Operaciones', 'profile_coo'),
        (true, true, 'OPS', 'Operations Assistant', 'Asistente de Operaciones', 'profile_ops'),
        (true, true, 'CSO', 'Chief Sales Officer', 'Director de Ventas', 'profile_cso'),
        (true, true, 'SAL', 'Sales Assistant', 'Asistente de Ventas', 'profile_sal'),
        (true, false, 'B2C', 'Consumer Customer', 'Cliente Individual', 'profile_b2c'),
        (true, false, 'B2B', 'Business Customer', 'Cliente Empresarial', 'profile_b2b'),
        (true, false, 'B2G', 'Government Customer', 'Cliente Gubernamental', 'profile_b2g'),
        (true, false, 'TST', 'Test User', 'Usuario de Prueba', 'profile_tst')
    ) as data (boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
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
        t.boo_internal,
        t.txt_code,
        t.txt_description_en,
        t.txt_description_es,
        t.txt_icon
    from (
        select
            row_number() over () as rn,
            boo_active,
            boo_internal,
            txt_code,
            txt_description_en,
            txt_description_es,
            txt_icon
        from tabled_data
    ) t
    join (
        select
            row_number() over () as rn,
            idf_entity
        from entities_insert
    ) e on t.rn = e.rn
)
insert into profiles (
    idf_profile,
    boo_active,
    boo_internal,
    txt_code,
    txt_description_en,
    txt_description_es,
    txt_icon
)
select
    idf_entity,
    boo_active,
    boo_internal,
    txt_code,
    txt_description_en,
    txt_description_es,
    txt_icon
from matched_data;