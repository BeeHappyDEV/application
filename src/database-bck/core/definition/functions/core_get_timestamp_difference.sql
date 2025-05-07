/**
 * @openapi
 * core_get_timestamp_difference:
 *    options:
 *      tags:
 *        - Core
 *      description: |
 *        | Direction | Type | Name |
 *        | :-------: | :--: | :--: |
 *        | Input | timestamp | in_tim_object_initial |
 *        | Input | timestamp | in_tim_object_final |
 *        | Output | text | |
 *        ```
 *        flowchart LR
 *        C((Client)) ---> P1[in_tim_object_initial
 *        timestamp]
 *        C((Client)) ---> P2[in_tim_object_final
 *        timestamp]
 *        P1 ---> F[(core_get_timestamp_difference)]
 *        P2 ---> F[(core_get_timestamp_difference)]
 *        F ---> R[returns
 *        text]
 *        R ---> C
 *        ```
 */

drop function if exists core_get_timestamp_difference;

create or replace function core_get_timestamp_difference (
    in in_tim_object_initial timestamp,
    in in_tim_object_final timestamp
)
returns text as $body$
begin

    return (extract (epoch from (in_tim_object_final - in_tim_object_initial))) :: text;

end;
$body$ language plpgsql;