drop function if exists system_get_empty_node;

create or replace function system_get_empty_node (
    in in_jsn_object json
)
returns json as $body$
begin

    if (

        in_jsn_object is null or
        in_jsn_object :: text = '' or
        in_jsn_object :: text = '{}'

    ) then

        return '{}' :: json;

    else

        return in_jsn_object;

    end if;

end;
$body$ language plpgsql;