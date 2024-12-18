drop function if exists robot_associate_page;

create or replace function robot_associate_page (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_txt_version text;
begin

    var_jsn_status = result_set_status ();
    var_jsn_incoming = core_get_json_empty ((in_jsn_incoming) :: json);
    var_jsn_outgoing = core_get_json_empty (null :: json);

    select
        cst.txt_value
    into
        var_txt_version
    from
        dat_constants cst
    where
        cst.txt_key = 'website_version';

    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_version', var_txt_version);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_get_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;