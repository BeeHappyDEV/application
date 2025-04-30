drop table if exists dat_foment_units cascade;

create table if not exists dat_foment_units (
    idf_foment_unit integer,
    boo_calculated  boolean,
    num_absolute    numeric (8,2),
    num_day         smallint,
    num_month       smallint,
    num_percentage  numeric (8,2),
    num_value       numeric (8,2),
    num_variation   smallint,
    num_year        smallint,
    constraint dat_foment_units_pk primary key (idf_foment_unit)
);

comment on table dat_foment_units is 'fun';