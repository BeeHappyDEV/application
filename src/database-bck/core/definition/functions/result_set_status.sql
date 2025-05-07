/**
 * @openapi
 * (a revisar) result_set_status:
 *    options:
 *      tags:
 *        - Core
 *      description: |
 *        | Direction | Type | Name |
 *        | :-------: | :--: | :--: |
 *        | Output | json | |
 *        ```
 *        flowchart LR
 *        C((Client)) ---> F[(result_set_status)]
 *        F ---> R[returns
 *        json]
 *        R ---> C
 *        ```
 */

drop function if exists result_set_status;

create or replace function result_set_status (
)
returns json as $body$
declare
    var_jsn_status json;
    var_jsn_starting json;
    var_tim_starting timestamp;
begin

    var_tim_starting = core_get_timestamp_value ();

    var_jsn_starting = core_get_timestamp_object (var_tim_starting);

    var_jsn_status = core_set_json_text (var_jsn_status, 'tim_starting', var_jsn_starting ->> 'tim_datetime');

    return var_jsn_status;

end;
$body$ language plpgsql;