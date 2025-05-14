drop function if exists framework.get_time_value;

create or replace function framework.get_time_value ()
returns timestamp as $body$
declare
    var_num_timezone_difference numeric;
begin

    select
        cst.txt_value :: numeric
    into
        var_num_timezone_difference
    from
        commons.constants cst
    where
        cst.txt_key = 'timezone_difference';

    return timeofday () :: timestamp + (var_num_timezone_difference || ' hour') :: interval;

end;
$body$ language plpgsql;