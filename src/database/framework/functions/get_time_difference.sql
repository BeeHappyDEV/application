drop function if exists framework.get_time_difference;

create or replace function framework.get_time_difference (
    in in_tim_object_initial timestamp,
    in in_tim_object_final timestamp
)
returns text as $body$
begin

    return (extract (epoch from (in_tim_object_final - in_tim_object_initial))) :: text;

end;
$body$ language plpgsql;