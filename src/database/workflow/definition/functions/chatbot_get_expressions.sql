drop function if exists chatbot_get_expressions;

create or replace function chatbot_get_expressions (
    in in_jsn_transfer json
)
returns json as $body$
declare
    var_idf_expression numeric;
    var_jsn_expression json;
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_num_expression numeric;
    var_rec_expressions record;
    var_txt_expression text;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_transfer ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_transfer ->> 'outgoing') :: json);
    var_jsn_status = core_get_json_empty ((in_jsn_transfer ->> 'status') :: json);

    var_idf_expression = core_get_json_numeric (var_jsn_outgoing, 'idf_expression');

    var_num_expression = 1;

    for var_rec_expressions in

        select distinct
            exp.idf_expression,
            exp.num_offset
        from
            dat_expressions exp
        where
            exp.idf_expression = var_idf_expression
        order by
            exp.num_offset

    loop

        select
            exp.txt_expression
        into
            var_txt_expression
        from
            dat_expressions exp
        where
            exp.idf_expression = var_rec_expressions.idf_expression
            and exp.num_offset = var_rec_expressions.num_offset
        order by
            random ()
        limit 1;

        var_jsn_expression = core_get_json_empty (null);
        var_jsn_expression = core_set_json_numeric (var_jsn_expression, 'num_expression', var_num_expression);
        var_jsn_expression = core_set_json_text (var_jsn_expression, 'txt_type', 'text');
        var_jsn_expression = core_set_json_text (var_jsn_expression, 'txt_content', var_txt_expression);

        var_jsn_outgoing = core_set_json_array (var_jsn_outgoing, 'arr_expressions', var_jsn_expression);

        var_num_expression = var_num_expression + 1;

    end loop;

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;