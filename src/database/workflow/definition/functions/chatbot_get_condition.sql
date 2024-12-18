drop function if exists chatbot_get_condition;

create or replace function chatbot_get_condition (
    in in_jsn_transfer json
)
returns json as $body$
declare
    var_idf_intention numeric;
    var_idf_unhandled numeric;
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_jsn_function json;
    var_num_count numeric;
    var_num_selection numeric;
    var_obj_intentions json;
    var_txt_sender text;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_transfer ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_transfer ->> 'outgoing') :: json);
    var_jsn_status = core_get_json_empty ((in_jsn_transfer ->> 'status') :: json);

    var_idf_intention = core_get_json_numeric (var_jsn_outgoing, 'idf_intention');
    var_txt_sender = core_get_json_text (var_jsn_outgoing, 'txt_sender');

    select
        case
            when var_idf_intention = 8010 then 1
            when var_idf_intention = 8020 then 2
            when var_idf_intention = 8030 then 3
            when var_idf_intention = 8040 then 4
            when var_idf_intention = 8050 then 5
            when var_idf_intention = 8060 then 6
            when var_idf_intention = 8070 then 7
            when var_idf_intention = 8080 then 8
            when var_idf_intention = 8090 then 9
            else 0
        end
    into
        var_num_selection;

    if (var_num_selection = 0) then

        --return result_set_return (in_jsn_incoming, var_jsn_incoming, var_jsn_outgoing);
        return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

    end if;

    select
        count (cnd.*)
    into
        var_num_count
    from
        dat_conditions cnd
    where
        cnd.txt_sender = var_txt_sender
        and cnd.boo_dependency = true;

    if (var_num_count = 0) then

        var_jsn_outgoing = core_del_json_node (var_jsn_outgoing, 'idf_intention');
        var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_intention', var_idf_unhandled);

        --var_jsn_function = result_set_return (in_jsn_incoming, var_jsn_incoming, var_jsn_outgoing);
        --var_jsn_function = chatbot_get_function (var_jsn_function);
        return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

        --return var_jsn_function;

    end if;

    select
        cnd.idf_intention
    into
        var_idf_intention
    from
        dat_conditions cnd
    where
        cnd.txt_sender = var_txt_sender
        and cnd.boo_dependency = true;

    var_jsn_outgoing = core_del_json_node (var_jsn_outgoing, 'idf_intention');
    var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_intention', var_idf_intention);

    var_jsn_function = result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);
    var_jsn_function = chatbot_get_function (var_jsn_function);
    var_jsn_function = chatbot_set_function (var_jsn_function);

    var_jsn_outgoing = core_get_json_empty ((var_jsn_function ->> 'outgoing') :: json);

    var_obj_intentions = core_get_json_json (var_jsn_outgoing, 'obj_intentions');

    var_idf_intention = var_obj_intentions ->> (var_num_selection - 1) :: integer;

    if (var_idf_intention is null) then

        var_jsn_outgoing = core_del_json_node (var_jsn_outgoing, 'idf_intention');
        var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_intention', var_idf_unhandled);

        var_jsn_function = result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);
        var_jsn_function = chatbot_get_function (var_jsn_function);

        return var_jsn_function;

    end if;

    var_jsn_outgoing = core_del_json_node (var_jsn_outgoing, 'idf_intention');
    var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_intention', var_idf_intention);

    var_jsn_function = result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);
    var_jsn_function = chatbot_get_function (var_jsn_function);

    var_jsn_outgoing = core_get_json_empty ((var_jsn_function ->> 'outgoing') :: json);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;