drop function if exists workflow_run_chatbot;

create or replace function workflow_run_chatbot (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_transfer json;
begin

    var_jsn_transfer = result_set_transfer (in_jsn_incoming);

    var_jsn_transfer = chatbot_get_authentication (var_jsn_transfer);
    var_jsn_transfer = chatbot_get_message (var_jsn_transfer);
    var_jsn_transfer = chatbot_get_intention (var_jsn_transfer);
    raise notice 'aaa: %', var_jsn_transfer;
    var_jsn_transfer = chatbot_exe_function (var_jsn_transfer);
    var_jsn_transfer = chatbot_get_expressions (var_jsn_transfer);
    var_jsn_transfer = chatbot_set_messages (var_jsn_transfer);

    return var_jsn_transfer;

    --in_jsn_incoming = chatbot_get_condition (in_jsn_incoming);
/*



        /*var_jsn_transfer = chatbot_get_flow (var_jsn_transfer);*/
var_jsn_transfer = chatbot_get_intention (var_jsn_transfer);
    --var_jsn_transfer = chatbot_get_authorization (var_jsn_transfer);
    --var_jsn_transfer = chatbot_get_condition (var_jsn_transfer);





    raise notice 'chatbot_set_function';
    raise notice '%', in_jsn_incoming;
    in_jsn_incoming = chatbot_set_function (in_jsn_incoming);

    raise notice 'chatbot_set_expression';
    raise notice '%', in_jsn_incoming;
    in_jsn_incoming = chatbot_set_expression (in_jsn_incoming);

    raise notice 'chatbot_set_message';
    raise notice '%', in_jsn_incoming;
    in_jsn_incoming = chatbot_set_message (in_jsn_incoming);

    raise notice 'chatbot_set_condition';
    raise notice '%', in_jsn_incoming;
    in_jsn_incoming = chatbot_set_condition (in_jsn_incoming);

    raise notice 'result_get_success';
    raise notice '%', in_jsn_incoming;

    var_jsn_incoming = core_get_json_empty ((var_jsn_transfer ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((var_jsn_transfer ->> 'outgoing') :: json);
    var_jsn_status = core_get_json_empty ((var_jsn_transfer ->> 'status') :: json);

    --return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);
    return result_get_success (null, null, var_jsn_outgoing);
*/
/*
return '{
    "status": {
        "tim_ending": "2023-10-11 00:00:00.000",
        "tim_elapsed": "0.000",
        "tim_starting": "2023-10-11 00:00:00.000",
        "boo_exception": false
    },
    "outgoing": [
        {
            "type": "text",
            "content": "Hola!!! Soy BeeBee 🤓, la asistOnta de BeeHappy"
        },
        {
            "type": "text",
            "content": "Te cuento que en estos momentos estoy en marcha blanca 😅"
        },
        {
            "type": "text",
            "content": "Pero pronto podré responder a todas tus consultas ☺️"
        },
        {
            "type": "button",
            "content": "No 🙄",
            "id": "id2"
        }
    ]
}'::json;
*/
/*
exception
    when others then

        var_jsn_incoming = core_get_json_empty ((var_jsn_transfer ->> 'incoming') :: json);
        var_jsn_status = core_get_json_empty ((var_jsn_transfer ->> 'status') :: json);

        return result_get_failed (var_jsn_status, var_jsn_incoming);
*/
end;
$body$ language plpgsql;