drop function if exists chatbot_set_messages;

create or replace function chatbot_set_messages (
    in in_jsn_transfer json
)
returns json as $body$
declare
    var_arr_expressions json;
    var_jsn_expression json;
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_jsn_parameters json;
    var_num_offset numeric;
    var_rec_expressions record;
    var_txt_content text;
    var_txt_offset text;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_transfer ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_transfer ->> 'outgoing') :: json);
    var_jsn_status = core_get_json_empty ((in_jsn_transfer ->> 'status') :: json);

    var_arr_expressions = core_get_json_array (var_jsn_outgoing, 'arr_expressions');
    var_jsn_parameters = core_get_json_json (var_jsn_outgoing, 'jsn_parameters');

    var_jsn_outgoing = core_del_json_node (var_jsn_outgoing, 'arr_expressions');

    for var_rec_expressions in

        select
            (json ->> 'num_expression') :: numeric "num_expression",
            (json ->> 'txt_type') :: text "txt_type",
            (json ->> 'txt_content') :: text "txt_content"
        from
            json_array_elements (var_arr_expressions) json
        order by
            (json ->> 'num_expression') :: numeric

    loop

        var_txt_content = var_rec_expressions.txt_content;

        for var_num_offset in 0 .. 9 loop

            var_txt_offset = '%' || var_num_offset;

            if position (var_txt_offset in var_rec_expressions.txt_content) > 0 then

                var_txt_content = replace (var_txt_content, var_txt_offset, var_jsn_parameters ->> var_txt_offset);

            end if;

        end loop;

        var_jsn_expression = core_get_json_empty (null);
        var_jsn_expression = core_set_json_numeric (var_jsn_expression, 'num_expression', var_rec_expressions.num_expression);
        var_jsn_expression = core_set_json_text (var_jsn_expression, 'txt_type', var_rec_expressions.txt_type);
        var_jsn_expression = core_set_json_text (var_jsn_expression, 'txt_content', var_txt_content);

        var_jsn_outgoing = core_set_json_array (var_jsn_outgoing, 'arr_expressions', var_jsn_expression);

    end loop;

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;