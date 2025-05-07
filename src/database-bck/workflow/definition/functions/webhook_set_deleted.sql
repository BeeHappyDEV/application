drop function if exists webhook_set_deleted;

create or replace function webhook_set_deleted (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_arr_labels text [];
    var_idf_issue numeric;
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_txt_issue text;
    var_txt_status text;
    var_txt_summary text;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_incoming ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_incoming ->> 'outgoing') :: json);
    in_jsn_incoming = core_del_json_node (in_jsn_incoming, 'incoming');
    in_jsn_incoming = core_del_json_node (in_jsn_incoming, 'outgoing');

    var_arr_labels = core_get_json_array (var_jsn_outgoing, 'arr_labels');
    var_txt_issue = core_get_json_text (var_jsn_outgoing, 'txt_issue');
    var_txt_status = core_get_json_text (var_jsn_outgoing, 'txt_status');
    var_txt_summary = core_get_json_text (var_jsn_outgoing, 'txt_summary');

    select
        iss.idf_issue
    into
        var_idf_issue
    from
        dat_issues iss
    where
        iss.txt_issue = var_txt_issue;

    update dat_issues set
        sys_status = false
    where
        idf_issue = var_idf_issue;

    return result_set_return (in_jsn_incoming, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;