drop function if exists chatbot_exe_function;

create or replace function chatbot_exe_function (
    in in_jsn_transfer json
)
returns json as $body$
declare
    var_boo_required boolean;
    var_idf_intention numeric;
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_jsn_subroutine json;
    var_txt_function text;
    var_txt_sentence text;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_transfer ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_transfer ->> 'outgoing') :: json);
    var_jsn_status = core_get_json_empty ((in_jsn_transfer ->> 'status') :: json);

    var_boo_required = core_get_json_boolean (var_jsn_outgoing, 'boo_required');
    var_idf_intention = core_get_json_numeric (var_jsn_outgoing, 'idf_intention');
    var_txt_function = core_get_json_text (var_jsn_outgoing, 'txt_function');

    var_jsn_subroutine = result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

    var_txt_sentence = 'select ' || var_txt_function || ' (' || chr (39) || var_jsn_subroutine || chr (39) || ')';

    execute
        var_txt_sentence
    into
        var_jsn_subroutine;

    var_jsn_outgoing = core_get_json_empty ((var_jsn_subroutine ->> 'outgoing') :: json);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;