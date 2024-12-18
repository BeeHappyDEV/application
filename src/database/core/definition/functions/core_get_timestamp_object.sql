/**
 * @openapi
 * core_get_timestamp_object:
 *    options:
 *      tags:
 *        - Core
 *      description: |
 *        | Direction | Type | Name |
 *        | :-------: | :--: | :--: |
 *        | Input | timestamp | in_tim_object |
 *        | Output | json | |
 *        ```
 *        flowchart LR
 *        C((Client)) ---> P1[in_tim_object
 *        timestamp]
 *        P1 ---> F[(core_get_timestamp_object)]
 *        F ---> R[returns
 *        text]
 *        R ---> C
 *        ```
 */

drop function if exists core_get_timestamp_object;

create or replace function core_get_timestamp_object (
    in in_tim_object timestamp
)
returns json as $body$
declare
    var_tim_date text;
    var_tim_datetime text;
    var_tim_time text;
begin

    var_tim_date = date (in_tim_object) :: text;

    var_tim_time = to_char (in_tim_object, 'hh24:mi:ss') || '.' || split_part (round (extract (epoch from (in_tim_object)) :: text :: numeric, 3)::text, '.' , 2);

    var_tim_datetime = var_tim_date || ' ' || var_tim_time;

    return json_build_object ('tim_datetime', var_tim_datetime);

end;
$body$ language plpgsql;