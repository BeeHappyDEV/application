drop function if exists webhook_set_function;

create or replace function webhook_set_function (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_subroutine json;
    var_txt_function text;
    var_txt_sentence text;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_incoming ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_incoming ->> 'outgoing') :: json);
    in_jsn_incoming = core_del_json_node (in_jsn_incoming, 'incoming');
    in_jsn_incoming = core_del_json_node (in_jsn_incoming, 'outgoing');

    var_txt_function = core_get_json_text (var_jsn_outgoing, 'txt_function');

    if (var_txt_function is not null) then

        var_jsn_subroutine = result_set_return (in_jsn_incoming, var_jsn_incoming, var_jsn_outgoing);

        var_txt_sentence = 'select ' || var_txt_function || ' (' || chr (39) || var_jsn_subroutine || chr (39) || ')';

        execute
            var_txt_sentence
        into
            var_jsn_subroutine;

        var_jsn_outgoing = core_get_json_empty ((var_jsn_subroutine ->> 'outgoing') :: json);

    end if;

    return result_set_return (in_jsn_incoming, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;