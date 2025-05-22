drop function if exists framework.update_registry;

create or replace function framework.update_registry ()
returns trigger as $$
begin
    new.sys_timestamp = now ();
    new.sys_version = old.sys_version + 1;
    return new;
end;
$$ language plpgsql;

create trigger framework.update_registry
before update on framework.registries
for each row
execute function framework.update_registry ();