drop function if exists result.initializer;

create or replace function result.initializer (
)
returns json as $body$
declare
    var_jsn_status json;
    var_jsn_starting json;
    var_tim_starting timestamp;
begin

    var_tim_starting = framework.get_time_value ();

    var_jsn_starting = framework.get_time_object (var_tim_starting);

    var_jsn_status = '{}' :: json;
    var_jsn_status = framework.set_text (var_jsn_status, 'tim_starting', var_jsn_starting ->> 'tim_datetime');
    var_jsn_status = framework.set_text (var_jsn_status, 'process_id', gen_random_uuid () :: text);

    return var_jsn_status :: jsonb;

end;
$body$ language plpgsql;