drop table if exists registries cascade;

create table registries (
    idf_registry  uuid primary key default gen_random_uuid (),
    sys_active    boolean not null default true,
    sys_timestamp timestamp with time zone not null default now (),
    sys_version   smallint not null default 0
);

alter table registries enable row level security;