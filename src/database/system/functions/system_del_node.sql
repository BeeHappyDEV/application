drop function if exists system_del_node;

create or replace function system_del_node (
    in in_jsn_object json,
    in in_txt_key text
)
returns json as $body$
begin

    if (in_jsn_object is null) then

        return null;

    end if;

    if (in_txt_key is null) then

        raise exception 'the key cannot be null';

    end if;

    return in_jsn_object :: jsonb - in_txt_key;

end;
$body$ language plpgsql;