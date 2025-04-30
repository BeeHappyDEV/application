drop function if exists status_initializer;

create or replace function status_initializer (
)
returns json as $body$
declare
    var_jsn_status json;
    var_jsn_starting json;
    var_tim_starting timestamp;
begin

    var_tim_starting = get_time_value ();

    var_jsn_starting = get_time_object (var_tim_starting);

    var_jsn_status = '{}' :: json;
    var_jsn_status = set_text (var_jsn_status, 'tim_starting', var_jsn_starting ->> 'tim_datetime');
    var_jsn_status = set_text (var_jsn_status, 'process_id', gen_random_uuid () :: text);

    return var_jsn_status;

end;
$body$ language plpgsql;