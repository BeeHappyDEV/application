drop table if exists monthly_tax_units cascade;

create table if not exists monthly_tax_units (
    idf_monthly_tax_unit integer,
    num_absolute    numeric (8,2),
    num_month       smallint,
    num_percentage  numeric (8,2),
    num_value       numeric (8,2),
    num_variation   smallint,
    num_year        smallint,
    constraint monthly_tax_units_pk primary key (idf_monthly_tax_unit)
);

alter table monthly_tax_units enable row level security;

comment on table monthly_tax_units is 'mtu';