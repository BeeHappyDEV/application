/**
 * @openapi
 * dat_foment_units:
 *    head:
 *      tags:
 *        - Indicators
 *      description: |
 *        | Concept | Value |     |
 *        | :-----: | :---: | :-: |
 *        | Abbreviation | fun | |
 *        ```
 *        erDiagram
 *        dat_foment_units {
 *        idf_foment_unit numeric pk "dat_foment_units_pk"
 *        num_absolute    numeric
 *        num_day         numeric
 *        num_month       numeric
 *        num_percentage  numeric
 *        num_type        numeric
 *        num_value       numeric
 *        num_variation   numeric
 *        num_year        numeric
 *        }
 *        ```
 */
drop table if exists dat_foment_units cascade;

create table if not exists dat_foment_units (
    idf_foment_unit numeric,
    num_absolute    numeric,
    num_day         numeric,
    num_month       numeric,
    num_percentage  numeric,
    num_type        numeric,
    num_value       numeric,
    num_variation   numeric,
    num_year        numeric,
    constraint dat_foment_units_pk primary key (idf_foment_unit)
);

comment on table dat_foment_units is 'fun';