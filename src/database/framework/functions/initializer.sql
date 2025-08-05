drop function if exists result.initializer;

create or replace function result.initializer (
)
returns json as $body$
declare
    var_tim_starting timestamp;
begin

    var_tim_starting = framework.get_time_value ();

    return jsonb_build_object (
        'tim_starting', (framework.get_time_object (var_tim_starting) ->> 'tim_datetime'),
        'process_id', gen_random_uuid () :: text,
        'boo_exception', false
       );

end;
$body$ language plpgsql;