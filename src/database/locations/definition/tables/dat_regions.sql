/**
 * @openapi
 * dat_regions:
 *    head:
 *      tags:
 *        - Location
 *      description: |
 *        | Concept | Value |     |
 *        | :-----: | :---: | :-: |
 *        | Abbreviation | rgn | |
 *        ```
 *        erDiagram
 *        dat_regions {
 *        idf_region  numeric pk "dat_regions_pk"
 *        idf_country numeric fk "dat_regions_fk1"
 *        txt_region  text
 *        }
 *        dat_countries ||--|{ dat_regions : dat_regions_fk1
 *        dat_countries {
 *        idf_country numeric
 *        }
 *        ```
 */

drop table if exists dat_regions cascade;

create table if not exists dat_regions (
    idf_region  numeric,
    idf_country numeric,
    txt_region  text,
    constraint dat_regions_pk primary key (idf_region),
    constraint dat_regions_fk1 foreign key (idf_country) references dat_countries (idf_country)
);

comment on table dat_regions is 'rgn';