/**
 * @openapi
 * dat_countries:
 *    head:
 *      tags:
 *        - Location
 *      description: |
 *        | Concept | Value |     |
 *        | :-----: | :---: | :-: |
 *        | Abbreviation | cty | |
 *        ```
 *        erDiagram
 *        dat_countries {
 *        idf_country numeric pk "dat_countries_pk"
 *        txt_country text
 *        }
 *        ```
 */

drop table if exists dat_countries cascade;

create table if not exists dat_countries (
    idf_country numeric,
    txt_country text,
    constraint dat_countries_pk primary key (idf_country)
);

comment on table dat_countries is 'cty';