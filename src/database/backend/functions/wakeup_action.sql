drop function if exists backend.wakeup_action;

create or replace function backend.wakeup_action (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
begin

    var_jsn_status = result.initializer ();
    var_jsn_incoming = framework.get_empty_node ((in_jsn_incoming) :: json);
    var_jsn_outgoing = framework.get_empty_node (null :: json);

    return result.successfully (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result.failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;