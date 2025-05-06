drop table if exists entities cascade;

create table entities (
    idf_entity    uuid primary key default gen_random_uuid (),
    sys_active    boolean not null default true,
    sys_timestamp timestamp with time zone not null default now (),
    sys_version   smallint not null default 0
);

alter table entities enable row level security;

create or replace function fnc_update_entity ()
returns trigger as $$
begin
    new.sys_timestamp = now ();
    new.sys_version = old.sys_version + 1;
    return new;
end;
$$ language plpgsql;

create or replace function fnc_delete_entity ()
returns trigger as $$
begin
    new.sys_timestamp = now ();
    new.sys_version = old.sys_version + 1;
return new;
end;
$$ language plpgsql;

create trigger trg_update_entity
before update on entities
for each row
execute function fnc_update_entity ();

create trigger trg_delete_entity
before delete on entities
for each row
execute function fnc_delete_entity ();