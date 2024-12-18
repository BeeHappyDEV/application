drop function if exists frontend_policy_video_link;

create or replace function frontend_policy_video_link (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_txt_link text;
begin

    var_jsn_status = result_set_status ();
    var_jsn_incoming = core_get_json_empty ((in_jsn_incoming) :: json);
    var_jsn_outgoing = core_get_json_empty (null :: json);

    select
        cst.txt_value
    into
        var_txt_link
    from
        dat_constants cst
    where
        cst.txt_key = 'video_policy';

    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_redirect', var_txt_link);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_get_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;