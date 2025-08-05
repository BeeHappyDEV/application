drop function if exists framework.del_node;

create or replace function framework.del_node (
    in in_jsn_object json,
    in in_txt_key text
)
returns json as $body$
begin

    if (in_jsn_object is null) then

        return null;

    end if;

    return in_jsn_object :: jsonb - in_txt_key;

end;
$body$ language plpgsql;