do $$ begin begin
drop trigger if exists trg_before_update_organizations_users on dat_organizations_users cascade;
exception when others then null; end; end $$;
do $$ begin begin
drop trigger if exists trg_before_insert_organizations_users on dat_organizations_users cascade;
exception when others then null; end; end $$;
drop function if exists action_before_update_organizations_users cascade;
drop function if exists action_before_insert_organizations_users cascade;
drop sequence if exists seq_organizations_users cascade;
drop table if exists aud_organizations_users cascade;
drop table if exists dat_organizations_users cascade;

create table if not exists dat_organizations_users (
    idf_organization_user numeric,
    idf_organization      numeric,
    idf_user              numeric,
    constraint dat_organizations_users_pk primary key (idf_organization_user),
    constraint dat_organizations_users_fk1 foreign key (idf_organization) references dat_organizations (idf_organization),
    constraint dat_organizations_users_fk2 foreign key (idf_user) references dat_users (idf_user)
) inherits (sys_default);

comment on table dat_organizations_users is 'oru';

create table if not exists aud_organizations_users
as table dat_organizations_users;

alter table aud_organizations_users
add constraint aud_organizations_users_fk0 foreign key (idf_organization_user) references dat_organizations_users (idf_organization_user),
add constraint aud_organizations_users_fk1 foreign key (idf_organization) references dat_organizations (idf_organization),
add constraint dat_organizations_users_fk1 foreign key (idf_user) references dat_users (idf_user);

create index if not exists aud_organizations_users_ix0 on aud_organizations_users (idf_organization_user);

create sequence if not exists seq_organizations_users
start with 1 increment by 1;

create or replace function action_before_insert_organizations_users ()
returns trigger as $body$
begin

    new.sys_timestamp = core_get_timestamp_value ();
    new.sys_status = true;
    new.sys_version = 0;

    return new;

end;
$body$ language plpgsql;

create trigger trg_before_insert_organizations_users
before insert on dat_organizations_users
for each row execute procedure action_before_insert_organizations_users ();

create or replace function action_before_update_organizations_users ()
returns trigger as $body$
begin

    insert into aud_organizations_users (
        sys_status,
        sys_timestamp,
        sys_user,
        sys_version,
        idf_organization,
        idf_organization_user,
        idf_user
    ) values (
        old.sys_status,
        old.sys_timestamp,
        old.sys_user,
        old.sys_version,
        old.idf_organization,
        old.idf_organization_user,
        old.idf_user
    );

    new.sys_timestamp = core_get_timestamp_value ();
    new.sys_version = old.sys_version + 1;

    return new;

end;
$body$ language plpgsql;

create trigger trg_before_update_organizations_users
before update on dat_organizations_users
for each row execute procedure action_before_update_organizations_users ();