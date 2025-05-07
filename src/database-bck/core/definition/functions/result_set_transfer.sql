/**
 * @openapi
 * (a revisar) result_set_transfer:
 *    options:
 *      tags:
 *        - Core
 *      description: |
 *        | Direction | Type | Name |
 *        | :-------: | :--: | :--: |
 *        | Input | json | in_jsn_incoming |
 *        | Output | json | |
 *        ```
 *        flowchart LR
 *        C((Client)) ---> P1[in_jsn_incoming
 *        json]
 *        P1 ---> F[(result_set_transfer)]
 *        F ---> R[returns
 *        json]
 *        R ---> C
 *        ```
 */

drop function if exists result_set_transfer;

create or replace function result_set_transfer (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_jsn_starting json;
    var_tim_starting timestamp;
begin

    var_tim_starting = core_get_timestamp_value ();

    var_jsn_starting = core_get_timestamp_object (var_tim_starting);

    var_jsn_status = core_set_json_text (var_jsn_status, 'tim_starting', var_jsn_starting ->> 'tim_datetime');

    var_jsn_incoming = core_get_json_empty ((in_jsn_incoming) :: json);

    var_jsn_outgoing = core_get_json_empty (null :: json);

    return json_build_object ('status', var_jsn_status) :: jsonb || json_build_object ('incoming', var_jsn_incoming) :: jsonb || json_build_object ('outgoing', var_jsn_outgoing) :: jsonb;

end;
$body$ language plpgsql;