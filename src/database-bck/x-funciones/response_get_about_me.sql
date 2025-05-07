drop function if exists response_get_about_me;

create or replace function response_get_about_me (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_parameters json;
    var_txt_deploy text;
    var_txt_version text;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_incoming ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_incoming ->> 'outgoing') :: json);
    in_jsn_incoming = core_del_json_node (in_jsn_incoming, 'incoming');
    in_jsn_incoming = core_del_json_node (in_jsn_incoming, 'outgoing');

    select
        cst.txt_value
    into
        var_txt_deploy
    from
        dat_constants cst
    where
        cst.idf_constant = 1011;

    select
        cst.txt_value
    into
        var_txt_version
    from
        dat_constants cst
    where
        cst.idf_constant = 1012;

    var_jsn_parameters = core_set_json_text (var_jsn_parameters, '1', var_txt_deploy);
    var_jsn_parameters = core_set_json_text (var_jsn_parameters, '2', var_txt_version);

    --var_jsn_outgoing = core_set_json_array (var_jsn_outgoing, 'arr_labels', var_arr_labels);
    var_jsn_outgoing = core_set_json_numeric (var_jsn_outgoing, 'idf_expression', 9010);

    var_jsn_outgoing = core_set_json_json (var_jsn_outgoing, 'jsn_parameters', var_jsn_parameters);

    return result_set_return (in_jsn_incoming, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;