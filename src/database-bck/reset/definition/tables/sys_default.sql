drop table if exists sys_default cascade;

create table if not exists dat_default (
    sys_status    boolean not null default true,
    sys_timestamp timestamp with time zone not null default now  (),
    sys_user      uuid references auth.users (id),
    sys_version   integer not null default 0,
    created_at    timestamp with time zone default now (),
    updated_at    timestamp with time zone default now ()
);

comment on table sys_default is 'sys';

alter table sys_default enable row level security;