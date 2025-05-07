drop function if exists webhook_get_flow;

create or replace function webhook_get_flow (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_arr_labels text [];
    var_jsn_fields json;
    var_jsn_incoming json;
    var_jsn_issue json;
    var_jsn_object json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_jsn_type json;
    var_txt_event text;
    var_txt_function text;
    var_txt_issue text;
    var_txt_status text;
    var_txt_summary text;
    var_txt_type text;
begin

    var_jsn_incoming = core_get_json_empty ((in_jsn_incoming ->> 'incoming') :: json);
    var_jsn_outgoing = core_get_json_empty ((in_jsn_incoming ->> 'outgoing') :: json);
    in_jsn_incoming = core_del_json_node (in_jsn_incoming, 'incoming');
    in_jsn_incoming = core_del_json_node (in_jsn_incoming, 'outgoing');

    var_jsn_object = core_get_json_lower (var_jsn_incoming);
    var_txt_event = core_get_json_text (var_jsn_object, 'webhookEvent');

    select
        case
            when var_txt_event = 'jira:issue_created' then 'webhook_set_created'
            when var_txt_event = 'jira:issue_deleted' then 'webhook_set_deleted'
            when var_txt_event = 'jira:issue_updated' then 'webhook_set_updated'
        end
    into
        var_txt_function;

    if (var_txt_function is not null) then

        var_jsn_issue = core_get_json_json (var_jsn_object, 'issue');

        var_jsn_fields = core_get_json_json (var_jsn_issue, 'fields');

        var_txt_issue = core_get_json_text (var_jsn_issue, 'key');

        var_arr_labels = core_get_json_array (var_jsn_fields, 'labels');

        var_txt_summary = core_get_json_text (var_jsn_fields, 'summary');

        var_jsn_status = core_get_json_json (var_jsn_fields, 'status');

        var_txt_status = core_get_json_text (var_jsn_status, 'name');

        var_jsn_type = core_get_json_json (var_jsn_fields, 'issuetype');

        var_txt_type = core_get_json_text (var_jsn_type, 'name');

        var_jsn_outgoing = core_set_json_array (var_jsn_outgoing, 'arr_labels', var_arr_labels);
        var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_function', var_txt_function);
        var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_issue', var_txt_issue);
        var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_status', var_txt_status);
        var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_summary', var_txt_summary);
        var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_type', var_txt_type);

    end if;

    return result_set_return (in_jsn_incoming, var_jsn_incoming, var_jsn_outgoing);

end;
$body$ language plpgsql;