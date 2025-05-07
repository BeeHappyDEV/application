/**
 * @openapi
 * result_get_success:
 *    options:
 *      tags:
 *        - Core
 *      description: |
 *        | Direction | Type | Name |
 *        | :-------: | :--: | :--: |
 *        | Input | json | in_jsn_status |
 *        | Input | json | in_jsn_incoming |
 *        | Input | text | in_jsn_outgoing |
 *        | Output | json | |
 *        ```
 *        flowchart LR
 *        C((Client)) ---> P1[in_jsn_status
 *        json]
 *        C((Client)) ---> P2[in_jsn_incoming
 *        json]
 *        C((Client)) ---> P3[in_jsn_outgoing
 *        json]
 *        P1 ---> F[(result_get_success)]
 *        P2 ---> F[(result_get_success)]
 *        P3 ---> F[(result_get_success)]
 *        F ---> R[returns
 *        json]
 *        R ---> C
 *        ```
 */

drop function if exists result_get_success;

create or replace function result_get_success (
    in in_jsn_status json,
    in in_jsn_incoming json,
    in in_jsn_outgoing json
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
    var_jsn_status = core_set_json_boolean (var_jsn_status, 'boo_exception', false);
    var_jsn_status = json_build_object ('status', var_jsn_status);

    return var_jsn_status :: jsonb || json_build_object ('incoming', in_jsn_incoming) :: jsonb || json_build_object ('outgoing', in_jsn_outgoing) :: jsonb;

end;
$body$ language plpgsql;