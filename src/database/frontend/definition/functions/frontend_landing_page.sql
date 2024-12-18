drop function if exists frontend_landing_page;

create or replace function frontend_landing_page (
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_incoming json;
    var_jsn_outgoing json;
    var_jsn_status json;
    var_txt_mail text;
    var_txt_phone text;
begin

    var_jsn_status = result_set_status ();
    var_jsn_incoming = core_get_json_empty ((in_jsn_incoming) :: json);
    var_jsn_outgoing = core_get_json_empty (null :: json);

     select
        usr.txt_mail,
        usr.num_whatsapp
    into
        var_txt_mail,
        var_txt_phone
    from
        dat_users usr
    where
        usr.idf_user = 0;

    select
        '+' || substring (var_txt_phone, 1, 2) || ' ' || substring (var_txt_phone, 3, 3) || ' ' || substring (var_txt_phone, 6, 3) || ' ' || substring (var_txt_phone, 9, 3)
    into
        var_txt_phone;

    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_phone', var_txt_phone);
    var_jsn_outgoing = core_set_json_text (var_jsn_outgoing, 'txt_mail', var_txt_mail);

    return result_get_success (var_jsn_status, var_jsn_incoming, var_jsn_outgoing);

exception
    when others then
        return result_get_failed (var_jsn_status, var_jsn_incoming);

end;
$body$ language plpgsql;