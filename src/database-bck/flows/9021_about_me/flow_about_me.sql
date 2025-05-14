/**
 * @openapi
 * flow_about_me:
 *    options:
 *      tags:
 *        - System
 *      description: |
 *        | Concept | Value |
 *        | :-----: | :---: |
 *        | Intentions | 9020 |
 *        | Expressions | 9021 |
 *        ```
 *        sequenceDiagram
 *        autonumber
 *        Actor Chatbot
 *        participant F as flow_about_me
 *        Chatbot ->> F: in_jsn_transfer
 *        F ->> F: select constants: framework.version
 *        F ->> F: select constants: framework.status
 *        F ->> F: idf_expression: 9021
 *        F -->> Chatbot: out_jsn_transfer
 *        ```
 */

drop function if exists flow_about_me;

create or replace function flow_about_me (
    in in_jsn_transfer json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_parameters json;
    var_jsn_status json;
    var_txt_status text;
    var_txt_version text;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_transfer ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_transfer ->> 'outgoing') :: json);
    var_jsn_status = core_get_json_empty ((in_jsn_transfer ->> 'status') :: json);

    select
        cst.txt_value
    into
        var_txt_version
    from
        dat_constants cst
    where
        cst.txt_key = 'framework.version';

    select
        cst.txt_value
    into
        var_txt_status
    from
        dat_constants cst
    where
        cst.txt_key = 'framework.status';

    var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_expression', 9021);
    var_jsn_parameters = core_set_json_text (var_jsn_parameters, '%1', var_txt_version);
    var_jsn_parameters = core_set_json_text (var_jsn_parameters, '%2', var_txt_status);
    var_jsn_outgoing = core_set_json_json (var_jsn_outgoing, 'jsn_parameters', var_jsn_parameters);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;