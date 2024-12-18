/**
 * @openapi
 * result_get_failed:
 *    options:
 *      tags:
 *        - Core
 *      description: |
 *        | Direction | Type | Name |
 *        | :-------: | :--: | :--: |
 *        | Input | json | in_jsn_status |
 *        | Input | json | in_jsn_incoming |
 *        | Output | json | |
 *        ```
 *        flowchart LR
 *        C((Client)) ---> P1[in_jsn_status
 *        json]
 *        C((Client)) ---> P2[in_jsn_incoming
 *        json]
 *        P1 ---> F[(result_get_failed)]
 *        P2 ---> F[(result_get_failed)]
 *        F ---> R[returns
 *        json]
 *        R ---> C
 *        ```
 */

drop function if exists result_get_failed;

create or replace function result_get_failed (
    in in_jsn_status json,
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_ending json;
    var_jsn_status json;
    var_tim_elapsed text;
    var_tim_ending timestamp;
    var_tim_starting timestamp;
begin

    in_jsn_status = core_del_json_node (in_jsn_status, 'tim_elapsed');
    in_jsn_status = core_del_json_node (in_jsn_status, 'tim_ending');

    var_tim_ending = core_get_timestamp_value ();

    var_jsn_ending = core_get_timestamp_object (var_tim_ending);

    var_jsn_status = core_set_json_text (in_jsn_status, 'tim_ending', var_jsn_ending ->> 'tim_datetime');

    var_tim_starting = core_get_json_text (in_jsn_status, 'tim_starting') :: timestamp;

    var_tim_ending = core_get_json_text (var_jsn_status, 'tim_ending') :: timestamp;

    var_tim_elapsed = core_get_timestamp_difference (var_tim_starting :: timestamp, var_tim_ending :: timestamp);

    var_jsn_status = core_set_json_text (var_jsn_status, 'tim_elapsed', var_tim_elapsed);
    var_jsn_status = core_set_json_boolean (var_jsn_status, 'boo_exception', true);
    var_jsn_status = json_build_object ('status', var_jsn_status);

    return var_jsn_status :: jsonb || json_build_object ('incoming', in_jsn_incoming) :: jsonb;

end;
$body$ language plpgsql;