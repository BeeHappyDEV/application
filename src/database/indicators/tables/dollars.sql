drop table if exists indicators.dollars cascade;

create table if not exists indicators.dollars (
    idf_dollar     integer,
    boo_calculated boolean,
    num_absolute   numeric (8,2),
    num_day        smallint,
    num_month      smallint,
    num_percentage numeric (8,2),
    num_value      numeric (8,2),
    num_variation  smallint,
    num_year       smallint,
    constraint dollars_pk primary key (idf_dollar)
);

alter table indicators.dollars enable row level security;

comment on table indicators.dollars is 'usd';