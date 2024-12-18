drop function if exists chatbot_get_flow;

create or replace function chatbot_get_flow (
    in in_jsn_transfer json
)
returns json as $body$
declare
    var_boo_active_flow boolean;
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_txt_sender text;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_transfer ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_transfer ->> 'outgoing') :: json);
    var_jsn_status = core_get_json_empty ((in_jsn_transfer ->> 'status') :: json);

    var_txt_sender = core_get_json_text (var_jsn_incoming, 'txt_sender');

    select
        cst.txt_value
    into
        var_boo_active_flow
    from
        dat_constants cst
    where
        cst.txt_key = 'maintenance_mode';

    if (var_boo_active_flow is true) then

        var_jsn_outgoing = core_del_json_node (var_jsn_outgoing, 'txt_message');
        var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_message', 'in maintenance');

    end if;

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_get_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;