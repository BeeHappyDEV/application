/**
 * @openapi
 * flow_reject_identifier:
 *    options:
 *      tags:
 *        - System
 *      description: |
 *        | Concept | Value |
 *        | :-----: | :---: |
 *        | Intentions | 9092 |
 *        | Expressions | 9092 |
 *        ```
 *        sequenceDiagram
 *        autonumber
 *        Actor Chatbot
 *        participant F as flow_reject_identifier
 *        Chatbot ->> F: in_jsn_transfer
 *        F ->> F: idf_expression: 9092
 *        F -->> Chatbot: out_jsn_transfer
 *        ```
 */

drop function if exists flow_reject_identifier;

create or replace function flow_reject_identifier (
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

    var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_expression', 9092);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;