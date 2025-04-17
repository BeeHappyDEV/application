do $$ begin begin
drop trigger if exists trg_before_update_users on dat_users cascade;
exception when others then null; end; end $$;
do $$ begin begin
drop trigger if exists trg_before_insert_users on dat_users cascade;
exception when others then null; end; end $$;
drop function if exists action_before_update_users cascade;
drop function if exists action_before_insert_users cascade;
drop sequence if exists seq_users cascade;
drop table if exists aud_users;
drop table if exists dat_users;

create table if not exists dat_users (
    idf_user       numeric,
    num_telegram   numeric,
    num_whatsapp   numeric,
    txt_first_name text,
    txt_last_name  text,
    txt_mail       text,
    txt_location   text,
    constraint dat_users_pk primary key (idf_user)
) inherits (sys_default);

comment on table dat_users is 'usr';

create table if not exists aud_users
as table dat_users;

alter table aud_users
add constraint aud_users_fk0 foreign key (idf_user) references dat_users (idf_user);

create index if not exists aud_users_ix0 on aud_users (idf_user);

create sequence if not exists seq_users
start with 1 increment by 1;

create or replace function action_before_insert_users ()
returns trigger as $body$
begin

    new.sys_timestamp = core_get_timestamp_value ();
    new.sys_status = true;
    new.sys_version = 0;

    return new;

end;
$body$ language plpgsql;

create trigger trg_before_insert_users
before insert on dat_users
for each row execute procedure action_before_insert_users ();

create or replace function action_before_update_users ()
returns trigger as $body$
begin

    insert into aud_users (
        sys_status,
        sys_timestamp,
        sys_user,
        sys_version,
        idf_user,
        num_telegram,
        num_whatsapp,
        txt_first_name,
        txt_last_name,
        txt_mail,
        txt_location
    ) values (
        old.sys_status,
        old.sys_timestamp,
        old.sys_user,
        old.sys_version,
        old.idf_user,
        old.num_telegram,
        old.num_whatsapp,
        old.txt_first_name,
        old.txt_last_name,
        old.txt_mail,
        old.txt_location
    );

    new.sys_timestamp = core_get_timestamp_value ();
    new.sys_version = old.sys_version + 1;

    return new;

end;
$body$ language plpgsql;

create trigger trg_before_update_users
before update on dat_users
for each row execute procedure action_before_update_users ();