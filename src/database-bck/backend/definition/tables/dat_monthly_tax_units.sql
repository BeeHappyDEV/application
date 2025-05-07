/**
 * @openapi
 * dat_monthly_tax_units:
 *    head:
 *      tags:
 *        - Indicators
 *      description: |
 *        | Concept | Value |     |
 *        | :-----: | :---: | :-: |
 *        | Abbreviation | mtu | |
 *        ```
 *        erDiagram
 *        dat_monthly_tax_units {
 *        idf_monthly_tax_unit numeric pk "dat_monthly_tax_units_pk"
 *        num_absolute         numeric
 *        num_month            numeric
 *        num_percentage       numeric
 *        num_type             numeric
 *        num_value            numeric
 *        num_variation        numeric
 *        num_year             numeric
 *        }
 *        ```
 */
drop table if exists dat_monthly_tax_units cascade;

create table if not exists dat_monthly_tax_units (
    idf_monthly_tax_unit numeric,
    num_absolute         numeric,
    num_month            numeric,
    num_percentage       numeric,
    num_type             numeric,
    num_value            numeric,
    num_variation        numeric,
    num_year             numeric,
    constraint dat_monthly_tax_units_pk primary key (idf_monthly_tax_unit)
);

comment on table dat_monthly_tax_units is 'mtu';