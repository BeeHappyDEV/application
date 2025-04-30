drop function if exists set_array;

create or replace function set_array (
    in in_jsn_object json,
    in in_txt_key text,
    in in_jsn_value json
)
returns json as $body$
declare
    var_boo_array boolean;
    var_jsn_object json;
    var_jsn_value json;
    var_jsn_node json;
begin

    if (in_txt_key is null) then

        raise exception 'the key cannot be null';

    end if;

    if (in_jsn_value is null) then

        raise exception 'the value cannot be null';

    end if;

    in_jsn_object = get_empty_node (in_jsn_object);

    if (in_jsn_object :: text = '{}') then

        return json_build_object (in_txt_key, jsonb_build_array (in_jsn_value));

    end if;

    var_jsn_node = get_node (in_jsn_object, in_txt_key);

    if (var_jsn_node is null) then

        return in_jsn_object :: jsonb || json_build_object (in_txt_key, jsonb_build_array (in_jsn_value)) :: jsonb;

    end if;

    var_jsn_value = in_jsn_object -> in_txt_key;

    var_boo_array = (json_typeof (var_jsn_value) != 'array');

    if var_boo_array then

        raise exception 'the existing is not an array';

    end if;

    var_jsn_object = json_build_object (in_txt_key, var_jsn_node :: jsonb || in_jsn_value :: jsonb);

    return in_jsn_object :: jsonb || var_jsn_object :: jsonb;

end ;
$body$ language plpgsql;