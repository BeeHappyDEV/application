drop function if exists webhook_set_created;

create or replace function webhook_set_created (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_arr_labels text [];
    var_idf_issue numeric;
    var_idf_organization numeric;
    var_idf_user numeric;
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_txt_issue text;
    var_txt_status text;
    var_txt_summary text;
    var_txt_type text;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_incoming ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_incoming ->> 'outgoing') :: json);
    in_jsn_incoming = core_del_json_node (in_jsn_incoming, 'incoming');
    in_jsn_incoming = core_del_json_node (in_jsn_incoming, 'outgoing');

    var_arr_labels = core_get_json_array (var_jsn_outgoing, 'arr_labels');
    var_txt_issue = core_get_json_text (var_jsn_outgoing, 'txt_issue');
    var_txt_status = core_get_json_text (var_jsn_outgoing, 'txt_status');
    var_txt_summary = core_get_json_text (var_jsn_outgoing, 'txt_summary');
    var_txt_type = core_get_json_text (var_jsn_outgoing, 'txt_type');

    select
        usr.idf_user
    into
        var_idf_user
    from
        dat_users usr
    where
        usr.num_phone = var_arr_labels [1] :: numeric;

    select
        org.idf_organization
    into
        var_idf_organization
    from
        dat_organizations org
    where
        org.idf_organization = var_arr_labels [2] :: numeric;

    var_idf_issue = core_get_sequence_next ('seq_issues');

    insert into dat_issues (
        sys_user,
        idf_issue,
        idf_organization,
        idf_user,
        num_phone,
        txt_issue,
        txt_status,
        txt_summary,
        txt_type
    ) values (
        0,
        var_idf_issue,
        var_idf_organization,
        var_idf_user,
        var_arr_labels [1] :: numeric,
        var_txt_issue,
        var_txt_status,
        var_txt_summary,
        var_txt_type
    );

    return result_set_return (in_jsn_incoming, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;