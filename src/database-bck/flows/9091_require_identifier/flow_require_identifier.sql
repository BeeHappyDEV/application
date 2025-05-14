/**
 * @openapi
 * flow_require_identifier:
 *    options:
 *      tags:
 *        - System
 *      description: |
 *        | Concept | Value |
 *        | :-----: | :---: |
 *        | Intentions | 9091 |
 *        | Expressions | 9091 |
 *        ```
 *        sequenceDiagram
 *        autonumber
 *        Actor Chatbot
 *        participant F as flow_require_identifier
 *        Chatbot ->> F: in_jsn_transfer
 *        F ->> F: select constants: framework.version
 *        F ->> F: select constants: framework.status
 *        F ->> F: idf_expression: 9091
 *        F -->> Chatbot: out_jsn_transfer
 *        ```
 */

drop function if exists flow_require_identifier;

create or replace function flow_require_identifier (
    in in_jsn_transfer json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_transfer ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_transfer ->> 'outgoing') :: json);
    var_jsn_status = core_get_json_empty ((in_jsn_transfer ->> 'status') :: json);

    var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_expression', 9091);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;