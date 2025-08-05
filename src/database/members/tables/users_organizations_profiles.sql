drop table if exists members.users_organizations_profiles cascade;

create table if not exists members.users_organizations_profiles (
    idf_user_organization_profile uuid primary key references framework.registries (idf_registry) on delete cascade,
    idf_user                      uuid references members.users (idf_user) on delete cascade,
    idf_organization              uuid references members.organizations (idf_organization) on delete cascade,
    idf_profile                   uuid references members.profiles (idf_profile) on delete cascade
) inherits (framework.registries);

alter table members.users_organizations_profiles enable row level security;

comment on table members.users_organizations_profiles is 'uop';

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.users_organizations_profiles (idf_user_organization_profile, idf_user, idf_organization, idf_profile)
select new.idf_registry, usr.idf_user, org.idf_organization, prf.idf_profile
from new_registry new, members.users usr, members.organizations org, members.profiles prf
where lower (usr.txt_first_name) like lower ('%beehappy%') and lower (org.txt_organization) like lower ('%beehappy%') and lower (prf.txt_code) = lower ('bee');

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.users_organizations_profiles (idf_user_organization_profile, idf_user, idf_organization, idf_profile)
select new.idf_registry, usr.idf_user, org.idf_organization, prf.idf_profile
from new_registry new, members.users usr, members.organizations org, members.profiles prf
where lower (usr.txt_first_name) like lower ('%beebee%') and lower (org.txt_organization) like lower ('%beehappy%') and lower (prf.txt_code) = lower ('ava');

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.users_organizations_profiles (idf_user_organization_profile, idf_user, idf_organization, idf_profile)
select new.idf_registry, usr.idf_user, org.idf_organization, prf.idf_profile
from new_registry new, members.users usr, members.organizations org, members.profiles prf
where lower (usr.txt_first_name) like lower ('%beejay%') and lower (org.txt_organization) like lower ('%beehappy%') and lower (prf.txt_code) = lower ('ava');

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.users_organizations_profiles (idf_user_organization_profile, idf_user, idf_organization, idf_profile)
select new.idf_registry, usr.idf_user, org.idf_organization, prf.idf_profile
from new_registry new, members.users usr, members.organizations org, members.profiles prf
where lower (usr.txt_first_name) like lower ('%alexis%') and lower (org.txt_organization) like lower ('%beehappy%') and lower (prf.txt_code) = lower ('ceo');

with new_registry as (insert into framework.registries default values returning idf_registry)
insert into members.users_organizations_profiles (idf_user_organization_profile, idf_user, idf_organization, idf_profile)
select new.idf_registry, usr.idf_user, org.idf_organization, prf.idf_profile
from new_registry new, members.users usr, members.organizations org, members.profiles prf
where lower (usr.txt_first_name) like lower ('%isabel%') and lower (org.txt_organization) like lower ('%beehappy%') and lower (prf.txt_code) = lower ('tst');