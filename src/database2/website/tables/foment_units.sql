drop table if exists foment_units cascade;

create table if not exists foment_units (
    idf_foment_unit integer,
    boo_calculated  boolean,
    num_absolute    numeric (8,2),
    num_day         smallint,
    num_month       smallint,
    num_percentage  numeric (8,2),
    num_value       numeric (8,2),
    num_variation   smallint,
    num_year        smallint,
    constraint foment_units_pk primary key (idf_foment_unit)
);

alter table foment_units enable row level security;

comment on table foment_units is 'fun';