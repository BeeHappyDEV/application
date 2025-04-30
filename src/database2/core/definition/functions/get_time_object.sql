drop function if exists get_time_object;

create or replace function get_time_object (
    in in_tim_object timestamp
)
returns json as $body$
declare
    var_tim_date text;
    var_tim_datetime text;
    var_tim_time text;
begin

    var_tim_date = date (in_tim_object) :: text;

    var_tim_time = to_char (in_tim_object, 'hh24:mi:ss') || '.' || split_part (round (extract (epoch from (in_tim_object)) :: text :: numeric, 3)::text, '.' , 2);

    var_tim_datetime = var_tim_date || ' ' || var_tim_time;

    return json_build_object ('tim_datetime', var_tim_datetime);

end;
$body$ language plpgsql;