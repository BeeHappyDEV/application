/**
 * @openapi
 * dat_dollars:
 *    head:
 *      tags:
 *        - Indicators
 *      description: |
 *        | Concept | Value |     |
 *        | :-----: | :---: | :-: |
 *        | Abbreviation | usd | |
 *        ```
 *        erDiagram
 *        dat_dollars {
 *        idf_dollar     numeric pk "dat_dollars_pk"
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

drop table if exists dat_dollars cascade;

create table if not exists dat_dollars (
    idf_dollar     numeric,
    num_absolute   numeric,
    num_day        numeric,
    num_month      numeric,
    num_percentage numeric,
    num_type       numeric,
    num_value      numeric,
    num_variation  numeric,
    num_year       numeric,
    constraint dat_dollars_pk primary key (idf_dollar)
);

comment on table dat_dollars is 'usd';