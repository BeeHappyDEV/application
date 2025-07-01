drop table if exists members_organizations_profiles cascade;

create table if not exists members_organizations_profiles (
    idf_member_organization_profile uuid primary key references registries (idf_registry) on delete cascade,
    idf_member                      uuid references members (idf_member) on delete cascade,
    idf_organization                uuid references organizations (idf_organization) on delete cascade,
    idf_profile                     uuid references profiles (idf_profile) on delete cascade
);

alter table members_organizations_profiles enable row level security;

comment on table members_organizations_profiles is 'mop';

with tabled_data as (
    select *
    from (
        select
            mem.idf_member,
            org.idf_organization,
            prf.idf_profile
        from
            members mem,
            organizations org,
            profiles prf
        where
            lower (mem.txt_first_name) like lower ('%beehappy%')
            and lower (org.txt_organization) like lower ('%beehappy%')
            and lower (prf.txt_code) = lower ('bee')
        union all
        select
            mem.idf_member,
            org.idf_organization,
            prf.idf_profile
        from
            members mem,
            organizations org,
            profiles prf
        where
            lower (mem.txt_first_name) like lower ('%beebee%')
            and lower (org.txt_organization) like lower ('%beehappy%')
            and lower (prf.txt_code) = lower ('ava')
        union all
        select
            mem.idf_member,
            org.idf_organization,
            prf.idf_profile
        from
            members mem,
            organizations org,
            profiles prf
        where
            lower (mem.txt_first_name) like lower ('%beejay%')
            and lower (org.txt_organization) like lower ('%beehappy%')
            and lower (prf.txt_code) = lower ('ava')
        union all
        select
            mem.idf_member,
            org.idf_organization,
            prf.idf_profile
        from
            members mem,
            organizations org,
            profiles prf
        where
            lower (mem.txt_first_name) like lower ('%alexis%')
            and lower (org.txt_organization) like lower ('%beehappy%')
            and lower (prf.txt_code) = lower ('ceo')
        union all
        select
            mem.idf_member,
            org.idf_organization,
            prf.idf_profile
        from
            members mem,
            organizations org,
            profiles prf
        where
            lower (mem.txt_first_name) like lower ('%isabel%')
            and lower (org.txt_organization) like lower ('%prueba%')
            and lower (prf.txt_code) = lower ('tst')
    ) as data (idf_member, idf_organization, idf_profile)
),
registries_insert as (
    insert into registries
    select from generate_series (1, (select count (*) from tabled_data))
    returning idf_registry
),
matched_data as (
    select
        e.idf_registry,
        t.idf_member,
        t.idf_organization,
        t.idf_profile
    from (
        select
            row_number() over () as rn,
            idf_member,
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
insert into members_organizations_profiles (
    idf_member_organization_profile,
    idf_member,
    idf_organization,
    idf_profile
)
select
    idf_registry,
    idf_member,
    idf_organization,
    idf_profile
from matched_data;