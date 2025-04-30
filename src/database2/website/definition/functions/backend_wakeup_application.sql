drop function if exists backend_wakeup_application;

create or replace function backend_wakeup_application (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
begin

    var_jsn_status = status_initializer ();
    var_jsn_incoming = get_empty_node ((in_jsn_incoming) :: json);
    var_jsn_outgoing = get_empty_node (null :: json);

    return result_successfully (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;