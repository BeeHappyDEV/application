drop table if exists dat_dollars cascade;

create table if not exists dat_dollars (
    idf_dollar     integer,
    boo_calculated boolean,
    num_absolute   numeric (8,2),
    num_day        smallint,
    num_month      smallint,
    num_percentage numeric (8,2),
    num_value      numeric (8,2),
    num_variation  smallint,
    num_year       smallint,
    constraint dat_dollars_pk primary key (idf_dollar)
);

comment on table dat_dollars is 'usd';