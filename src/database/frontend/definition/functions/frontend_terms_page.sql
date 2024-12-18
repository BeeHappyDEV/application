drop function if exists frontend_terms_page;

create or replace function frontend_terms_page (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
begin

    var_jsn_status = result_set_status ();
    var_jsn_incoming = core_get_json_empty ((in_jsn_incoming) :: json);
    var_jsn_outgoing = core_get_json_empty (null :: json);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_get_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;