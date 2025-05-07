drop function if exists system_get_array;

create or replace function system_get_array (
    in in_jsn_object json,
    in in_txt_key text
)
returns json as $body$
declare
    var_jsn_value json;
begin

    if (in_jsn_object is null) then

        return null;

    end if;

    if (in_txt_key is null) then

        raise exception 'the key cannot be null';

    end if;

    var_jsn_value = in_jsn_object -> in_txt_key;

    if (var_jsn_value is null or json_typeof (var_jsn_value) != 'array') then

        return null;

    end if;

    return var_jsn_value;

end;
$body$ language plpgsql;