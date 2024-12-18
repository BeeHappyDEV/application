/**
 * @openapi
 * sys_default:
 *    head:
 *      tags:
 *        - Reset
 *      description: |
 *        | Concept | Value |     |
 *        | :-----: | :---: | :-: |
 *        | Abbreviation | sys | |
 *        ```
 *        erDiagram
 *        sys_default {
 *        sys_status    boolean
 *        sys_timestamp timestamp
 *        sys_user      numeric
 *        sys_version   numeric
 *        }
 *        ```
 */

drop table if exists sys_default cascade;

create table if not exists sys_default (
    sys_status    boolean,
    sys_timestamp timestamp,
    sys_user      numeric,
    sys_version   numeric
);

comment on table sys_default is 'sys';