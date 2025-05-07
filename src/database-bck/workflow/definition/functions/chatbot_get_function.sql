drop function if exists chatbot_get_function;

create or replace function chatbot_get_function (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_boo_dependency boolean;
    var_boo_registered boolean;
    var_idf_intention numeric;
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_txt_function text;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_incoming ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_incoming ->> 'outgoing') :: json);
    in_jsn_incoming = core_del_json_node (in_jsn_incoming, 'incoming');
    in_jsn_incoming = core_del_json_node (in_jsn_incoming, 'outgoing');

    var_idf_intention = core_get_json_numeric (var_jsn_outgoing, 'idf_intention');

    select distinct
        int.boo_dependency,
        int.boo_registered,
        int.txt_function
    into
        var_boo_dependency,
        var_boo_registered,
        var_txt_function
    from
        dat_intentions int
    where
        int.idf_intention = var_idf_intention;

    var_jsn_outgoing = core_del_json_node (var_jsn_outgoing, 'boo_dependency');
    var_jsn_outgoing = core_del_json_node (var_jsn_outgoing, 'boo_registered');
    var_jsn_outgoing = core_del_json_node (var_jsn_outgoing, 'txt_function');
    var_jsn_outgoing = core_set_json_boolean (var_jsn_outgoing, 'boo_dependency', var_boo_dependency);
    var_jsn_outgoing = core_set_json_boolean (var_jsn_outgoing, 'boo_registered', var_boo_dependency);
    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_function', var_txt_function);

    return result_set_return (in_jsn_incoming, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;