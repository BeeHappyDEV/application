drop function if exists result.successfully;

create or replace function result.successfully (
    in in_jsn_status json,
    in in_jsn_incoming json,
    in in_jsn_outgoing json
)
returns json as $body$
declare
var_tim_ending timestamp;
    var_tim_starting timestamp;
    var_jsn_status jsonb;
BEGIN

    var_tim_ending = framework.get_time_value ();

    var_tim_starting = (var_jsn_status ->> 'tim_starting') :: timestamp;

    var_jsn_status = in_jsn_status :: jsonb;

    var_jsn_status = var_jsn_status || jsonb_build_object (
        'tim_ending', (framework.get_time_object (var_tim_ending) ->> 'tim_datetime'),
        'tim_elapsed', framework.get_time_difference (var_tim_starting, var_tim_ending),
        'boo_exception', false
    );

    return jsonb_build_object (
        'status', var_jsn_status,
        'incoming', in_jsn_incoming,
        'outgoing', in_jsn_outgoing
    );

end;
$body$ language plpgsql;