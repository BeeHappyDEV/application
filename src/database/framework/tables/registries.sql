drop table if exists registries cascade;

create table registries (
    idf_registry  uuid primary key default gen_random_uuid (),
    sys_active    boolean not null default true,
    sys_timestamp timestamp with time zone not null default now (),
    sys_version   smallint not null default 0
);

alter table registries enable row level security;

create or replace function fnc_update_registry ()
returns trigger as $$
begin
    new.sys_timestamp = now ();
    new.sys_version = old.sys_version + 1;
    return new;
end;
$$ language plpgsql;

create or replace function fnc_delete_registry ()
returns trigger as $$
begin
    new.sys_timestamp = now ();
    new.sys_version = old.sys_version + 1;
return new;
end;
$$ language plpgsql;

create trigger trg_update_registry
before update on registries
for each row
execute function fnc_update_registry ();

create trigger trg_delete_registry
before delete on registries
for each row
execute function fnc_delete_registry ();