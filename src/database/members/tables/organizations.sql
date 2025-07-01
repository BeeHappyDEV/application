drop table if exists members.organizations cascade;

create table if not exists members.organizations (
    idf_organization uuid primary key references framework.registries (idf_registry) on delete cascade,
    boo_active       boolean not null default true,
    idf_country      smallint not null,
    idf_region       smallint not null,
    idf_province     smallint not null,
    idf_commune      smallint not null,
    txt_organization text not null,
    constraint organizations_fk1 foreign key (idf_country) references commons.countries (idf_country),
    constraint organizations_fk2 foreign key (idf_region) references commons.regions (idf_region),
    constraint organizations_fk3 foreign key (idf_province) references commons.provinces (idf_province),
    constraint organizations_fk4 foreign key (idf_commune) references commons.communes (idf_commune)
) inherits (framework.registries);

alter table members.organizations enable row level security;

comment on table members.organizations is 'org';

with tabled_data as (
    select *
    from (values
        (true, 56, 13, 131, 13120, 'BeeHappy.dev'),
        (true, 56, 13, 131, 13120, 'Organización de Prueba')
    ) as data (boo_active, idf_country, idf_region, idf_province, idf_commune, txt_organization)
),
registries_insert as (
    insert into framework.registries
    select from generate_series (1, (select count (*) from tabled_data))
    returning idf_registry
),
matched_data as (
    select
        e.idf_registry,
        t.boo_active,
        t.idf_country,
        t.idf_region,
        t.idf_province,
        t.idf_commune,
        t.txt_organization
    from (
        select
            row_number() over () as rn,
            boo_active,
            idf_country,
            idf_region,
            idf_province,
            idf_commune,
            txt_organization
        from tabled_data
    ) t
    join (
        select
            row_number() over () as rn,
            idf_registry
        from registries_insert
    ) e on t.rn = e.rn
)
insert into members.organizations (
    idf_organization,
    boo_active,
    idf_country,
    idf_region,
    idf_province,
    idf_commune,
    txt_organization
)
select
    idf_registry,
    boo_active,
    idf_country,
    idf_region,
    idf_province,
    idf_commune,
    txt_organization
from matched_data;