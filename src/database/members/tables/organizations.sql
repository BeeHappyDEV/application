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

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.organizations (idf_organization, boo_active, idf_country, idf_region, idf_province, idf_commune, txt_organization)
select idf_registry, true, 56, 13, 131, 13120, 'BeeHappy.dev'
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.organizations (idf_organization, boo_active, idf_country, idf_region, idf_province, idf_commune, txt_organization)
select idf_registry, true, 56, 13, 131, 13120, 'Organización de Prueba'
from new_registry;