drop table if exists members.users_organizations_profiles cascade;

create table if not exists members.users_organizations_profiles (
    idf_user_organization_profile uuid primary key references framework.registries (idf_registry) on delete cascade,
    idf_user                      uuid references members.users (idf_user) on delete cascade,
    idf_organization              uuid references members.organizations (idf_organization) on delete cascade,
    idf_profile                   uuid references members.profiles (idf_profile) on delete cascade
) inherits (framework.registries);

alter table members.users_organizations_profiles enable row level security;

comment on table members.users_organizations_profiles is 'uop';

with tabled_data as (
    select *
    from (
        select
            usr.idf_user,
            org.idf_organization,
            prf.idf_profile
        from
            members.users usr,
            members.organizations org,
            members.profiles prf
        where
            lower (usr.txt_first_name) like lower ('%beehappy%')
            and lower (org.txt_organization) like lower ('%beehappy%')
            and lower (prf.txt_code) = lower ('bee')
        union all
        select
            usr.idf_user,
            org.idf_organization,
            prf.idf_profile
        from
            members.users usr,
            members.organizations org,
            members.profiles prf
        where
            lower (usr.txt_first_name) like lower ('%beebee%')
            and lower (org.txt_organization) like lower ('%beehappy%')
            and lower (prf.txt_code) = lower ('ava')
        union all
        select
            usr.idf_user,
            org.idf_organization,
            prf.idf_profile
        from
            members.users usr,
            members.organizations org,
            members.profiles prf
        where
            lower (usr.txt_first_name) like lower ('%beejay%')
            and lower (org.txt_organization) like lower ('%beehappy%')
            and lower (prf.txt_code) = lower ('ava')
        union all
        select
            usr.idf_user,
            org.idf_organization,
            prf.idf_profile
        from
            members.users usr,
            members.organizations org,
            members.profiles prf
        where
            lower (usr.txt_first_name) like lower ('%alexis%')
            and lower (org.txt_organization) like lower ('%beehappy%')
            and lower (prf.txt_code) = lower ('ceo')
        union all
        select
            usr.idf_user,
            org.idf_organization,
            prf.idf_profile
        from
            members.users usr,
            members.organizations org,
            members.profiles prf
        where
            lower (usr.txt_first_name) like lower ('%isabel%')
            and lower (org.txt_organization) like lower ('%beehappy%')
            and lower (prf.txt_code) = lower ('tst')
    ) as data (idf_user, idf_organization, idf_profile)
),
registries_insert as (
    insert into framework.registries
    select from generate_series (1, (select count (*) from tabled_data))
    returning idf_registry
),
matched_data as (
    select
        e.idf_registry,
        t.idf_user,
        t.idf_organization,
        t.idf_profile
    from (
        select
            row_number() over () as rn,
            idf_user,
            idf_organization,
            idf_profile
        from tabled_data
    ) t
    join (
        select
            row_number() over () as rn,
            idf_registry
        from registries_insert
    ) e on t.rn = e.rn
)
insert into members.users_organizations_profiles (
    idf_user_organization_profile,
    idf_user,
    idf_organization,
    idf_profile
)
select
    idf_registry,
    idf_user,
    idf_organization,
    idf_profile
from matched_data;