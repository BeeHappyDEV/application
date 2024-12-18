/**
 * @openapi
 * dat_euros:
 *    head:
 *      tags:
 *        - Indicators
 *      description: |
 *        | Concept | Value |     |
 *        | :-----: | :---: | :-: |
 *        | Abbreviation | eur | |
 *        ```
 *        erDiagram
 *        dat_euros {
 *        idf_euro       numeric pk "dat_euros_pk"
 *        num_absolute   numeric
 *        num_day        numeric
 *        num_month      numeric
 *        num_percentage numeric
 *        num_type       numeric
 *        num_value      numeric
 *        num_variation  numeric
 *        num_year       numeric
 *        }
 *        ```
 */

drop table if exists dat_euros cascade;

create table if not exists dat_euros (
    idf_euro       numeric,
    num_absolute   numeric,
    num_day        numeric,
    num_month      numeric,
    num_percentage numeric,
    num_type       numeric,
    num_value      numeric,
    num_variation  numeric,
    num_year       numeric,
    constraint dat_euros_pk primary key (idf_euro)
);

comment on table dat_euros is 'eur';