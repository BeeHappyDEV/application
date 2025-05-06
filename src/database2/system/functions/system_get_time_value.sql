drop function if exists system_get_time_value;

create or replace function system_get_time_value ()
returns timestamp as $body$
declare
    var_num_timezone_difference numeric;
begin

    select
        cst.txt_value :: numeric
    into
        var_num_timezone_difference
    from
        constants cst
    where
        cst.txt_key = 'timezone_difference';

    return timeofday () :: timestamp + (var_num_timezone_difference || ' hour') :: interval;

end;
$body$ language plpgsql;