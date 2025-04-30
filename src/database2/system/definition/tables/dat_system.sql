drop table if exists dat_system cascade;

create table if not exists dat_system (
    sys_status    boolean not null default true,
    sys_timestamp timestamptz not null default now  (),
    sys_user      uuid references auth.users (id),
    sys_version   smallint not null default 0,
    created_at    timestamptz default now (),
    updated_at    timestamptz default now ()
);

alter table dat_system enable row level security;