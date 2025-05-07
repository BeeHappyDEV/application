drop function if exists workflow_run_webhook;

create or replace function workflow_run_webhook (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
begin

    var_jsn_status = result_set_initial ();

    in_jsn_incoming = webhook_get_flow (in_jsn_incoming);
    in_jsn_incoming = webhook_set_function (in_jsn_incoming);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_get_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;