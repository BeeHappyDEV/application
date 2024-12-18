drop function if exists webhook_set_updated;

create or replace function webhook_set_updated (
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
    var_num_phone numeric;
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

    if (length (var_arr_labels [1]) = 4) then

        var_idf_organization = var_arr_labels [1] :: numeric;

        var_num_phone = var_arr_labels [2] :: numeric;

    else

        var_idf_organization = var_arr_labels [2] :: numeric;

        var_num_phone = var_arr_labels [1] :: numeric;

    end if;

    select
        org.idf_organization
    into
        var_idf_organization
    from
        dat_organizations org
    where
        org.idf_organization = var_idf_organization;

    select
        usr.idf_user
    into
        var_idf_user
    from
        dat_users usr
    where
        usr.num_phone = var_num_phone;

    update dat_issues set
        idf_organization = var_idf_organization,
        idf_user = var_idf_user,
        num_phone = var_num_phone,
        txt_status = var_txt_status,
        txt_summary = var_txt_summary
    where
        idf_issue = var_idf_issue;

    return result_set_return (in_jsn_incoming, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;