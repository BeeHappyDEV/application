/**
 * @openapi
 * dat_holidays:
 *    head:
 *      tags:
 *        - Constants
 *      description: |
 *        | Concept | Value |     |
 *        | :-----: | :---: | :-: |
 *        | Abbreviation | hld | |
 *        ```
 *        erDiagram
 *        dat_holidays {
 *        num_year  numeric pk "dat_holidays_pk"
 *        num_month numeric pk "dat_holidays_pk"
 *        num_day   numeric pk "dat_holidays_pk"
 *        }
 *        ```
 */

drop table if exists dat_holidays cascade;

create table if not exists dat_holidays (
    num_year  numeric,
    num_month numeric,
    num_day   numeric,
    constraint dat_holidays_pk primary key (num_year, num_month, num_day)
);

comment on table dat_holidays is 'hld';