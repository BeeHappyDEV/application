drop table if exists euros cascade;

create table if not exists euros (
    idf_euro       integer,
    boo_calculated boolean,
    num_absolute   numeric (8,2),
    num_day        smallint,
    num_month      smallint,
    num_percentage numeric (8,2),
    num_value      numeric (8,2),
    num_variation  smallint,
    num_year       smallint,
    constraint euros_pk primary key (idf_euro)
);

alter table euros enable row level security;

comment on table euros is 'eur';