drop function if exists result_failed;

create or replace function result_failed (
    in in_jsn_status json,
    in in_jsn_incoming json
)
returns json as $body$
declare
    var_jsn_ending json;
    var_jsn_status json;
    var_tim_elapsed text;
    var_tim_ending timestamp;
    var_tim_starting timestamp;
begin

    var_tim_ending = get_time_value ();
    var_jsn_ending = get_time_object (var_tim_ending);

    in_jsn_status = set_text (in_jsn_status, 'tim_ending', var_jsn_ending ->> 'tim_datetime');

    var_tim_starting = get_text (in_jsn_status, 'tim_starting') :: timestamp;
    var_tim_elapsed = get_time_difference (var_tim_starting, var_tim_ending);

    in_jsn_status = set_text (in_jsn_status, 'tim_elapsed', var_tim_elapsed);
    in_jsn_status = set_boolean (in_jsn_status, 'boo_exception', true);

    return json_build_object ('status', in_jsn_status, 'incoming', in_jsn_incoming);

end;
$body$ language plpgsql;