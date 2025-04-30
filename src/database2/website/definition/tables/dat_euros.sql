drop table if exists dat_euros cascade;

create table if not exists dat_euros (
    idf_euro       integer,
    boo_calculated boolean,
    num_absolute   numeric (8,2),
    num_day        smallint,
    num_month      smallint,
    num_percentage numeric (8,2),
    num_value      numeric (8,2),
    num_variation  smallint,
    num_year       smallint,
    constraint dat_euros_pk primary key (idf_euro)
);

comment on table dat_euros is 'eur';