do $$ begin begin
drop trigger if exists trg_before_update_organizations on dat_organizations cascade;
exception when others then null; end; end $$;
do $$ begin begin
drop trigger if exists trg_before_insert_organizations on dat_organizations cascade;
exception when others then null; end; end $$;
drop function if exists action_before_update_organizations cascade;
drop function if exists action_before_insert_organizations cascade;
drop sequence if exists seq_organizations cascade;
drop table if exists aud_organizations cascade;
drop table if exists dat_organizations cascade;

create table if not exists dat_organizations (
    idf_organization numeric,
    idf_country      numeric,
    idf_region       numeric,
    idf_province     numeric,
    idf_commune      numeric,
    txt_organization text,
    constraint dat_organizations_pk primary key (idf_organization),
    constraint dat_organizations_fk1 foreign key (idf_country) references dat_countries (idf_country),
    constraint dat_organizations_fk2 foreign key (idf_region) references dat_regions (idf_region),
    constraint dat_organizations_fk3 foreign key (idf_province) references dat_provinces (idf_province),
    constraint dat_organizations_fk4 foreign key (idf_commune) references dat_communes (idf_commune)
) inherits (sys_default);

comment on table dat_organizations is 'org';

create table if not exists aud_organizations
as table dat_organizations;

alter table aud_organizations
add constraint aud_organizations_fk0 foreign key (idf_organization) references dat_organizations (idf_organization),
add constraint aud_organizations_fk1 foreign key (idf_country) references dat_countries (idf_country),
add constraint aud_organizations_fk2 foreign key (idf_region) references dat_regions (idf_region),
add constraint aud_organizations_fk3 foreign key (idf_province) references dat_provinces (idf_province),
add constraint aud_organizations_fk4 foreign key (idf_commune) references dat_communes (idf_commune);

create index if not exists aud_organizations_ix0 on aud_organizations (idf_organization);

create sequence if not exists seq_organizations
start with 1 increment by 1;

create or replace function action_before_insert_organizations ()
returns trigger as $body$
begin

    new.sys_timestamp = core_get_timestamp_value ();
    new.sys_status = true;
    new.sys_version = 0;

    return new;

end;
$body$ language plpgsql;

create trigger trg_before_insert_organizations
before insert on dat_organizations
for each row execute procedure action_before_insert_organizations ();

create or replace function action_before_update_organizations ()
returns trigger as $body$
begin

    insert into aud_organizations (
        sys_status,
        sys_timestamp,
        sys_user,
        sys_version,
        idf_commune,
        idf_country,
        idf_organization,
        idf_province,
        idf_region,
        txt_organization
    ) values (
        old.sys_status,
        old.sys_timestamp,
        old.sys_user,
        old.sys_version,
        old.idf_commune,
        old.idf_country,
        old.idf_organization,
        old.idf_province,
        old.idf_region,
        old.txt_organization
    );

    new.sys_timestamp = core_get_timestamp_value ();
    new.sys_version = old.sys_version + 1;

    return new;

end;
$body$ language plpgsql;

create trigger trg_before_update_organizations
before update on dat_organizations
for each row execute procedure action_before_update_organizations ();