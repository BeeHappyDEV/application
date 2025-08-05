drop table if exists members.profiles cascade;

create table if not exists members.profiles (
    idf_profile        uuid primary key references framework.registries (idf_registry) on delete cascade,
    boo_active         boolean default true,
    boo_internal       boolean default true,
    txt_code           text not null,
    txt_description_en text not null,
    txt_description_es text not null,
    txt_icon           text
) inherits (framework.registries);

alter table members.profiles enable row level security;

comment on table members.profiles is 'prf';

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, true, 'BEE', 'Corporate Entity', 'Entidad Corporativa', null
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, true, 'AVA', 'Automated Virtual Assistant', 'Asistente Virtual Automatizado', 'profile_ava'
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, true, 'CEO', 'Chief Operating Officer', 'Director Ejecutivo', 'profile_ceo'
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, true, 'CMO', 'Chief Marketing Officer', 'Director de Marketing', null
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, true, 'MKT', 'Marketing Assistant', 'Asistente de Marketing', 'profile_ast'
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, true, 'CFO', 'Chief Financial Officer', 'Director Financiero', 'profile_cfo'
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, true, 'FIN', 'Finance Assistant', 'Asistente Financiero', 'profile_ast'
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, true, 'CTO', 'Chief Technology Officer', 'Director de Tecnología', 'profile_cto'
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, true, 'TEC', 'Tech Assistant', 'Asistente Técnico', 'profile_ast'
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, true, 'CCO', 'Chief Communications Officer', 'Director de Comunicaciones', null
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, true, 'COM', 'Communications Assistant', 'Asistente de Comunicaciones', 'profile_ast'
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, true, 'COO', 'Chief Operating Officer', 'Director de Operaciones', 'profile_coo'
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, true, 'OPS', 'Operations Assistant', 'Asistente de Operaciones', 'profile_ast'
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, true, 'CLO', 'Chief Legal Officer', 'Director Jurídico', 'profile_clo'
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, true, 'LEG', 'Legal Assistant', 'Asistente Jurídico', 'profile_ast'
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, true, 'CSO', 'Chief Sales Officer', 'Director de Ventas', 'profile_cso'
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, true, 'SAL', 'Sales Assistant', 'Asistente de Ventas', 'profile_ast'
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, false, 'B2C', 'Consumer Customer', 'Cliente Individual', null
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, false, 'B2B', 'Business Customer', 'Cliente Empresarial', null
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, false, 'B2G', 'Government Customer', 'Cliente Gubernamental', null
from new_registry;

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.profiles (idf_profile, boo_active, boo_internal, txt_code, txt_description_en, txt_description_es, txt_icon)
select idf_registry, true, false, 'TST', 'Test User', 'Usuario de Prueba', null
from new_registry;