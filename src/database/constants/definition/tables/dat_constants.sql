/**
 * @openapi
 * dat_constants:
 *    head:
 *      tags:
 *        - Constants
 *      description: |
 *        | Concept | Value |     |
 *        | :-----: | :---: | :-: |
 *        | Abbreviation | cst | |
 *        ```
 *        erDiagram
 *        dat_constants {
 *        idf_constant  numeric pk "dat_constants_pk"
 *        txt_module    text pk
 *        txt_submodule text
 *        txt_key       text
 *        txt_value     text
 *        }
 *        ```
 */

drop table if exists dat_constants cascade;

create table if not exists dat_constants (
    idf_constant  numeric,
    txt_module    text,
    txt_submodule text,
    txt_key       text,
    txt_value     text,
    constraint dat_constants_pk primary key (idf_constant)
);

comment on table dat_constants is 'cst';