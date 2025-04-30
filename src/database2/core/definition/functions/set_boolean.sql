drop function if exists set_boolean;

create or replace function set_boolean (
    in in_jsn_object json,
    in in_txt_key text,
    in in_boo_value boolean
)
returns json as $body$
declare
    var_boo_array boolean;
    var_jsn_object json;
    var_jsn_value json;
    var_boo_node boolean;
begin

    if (in_txt_key is null) then

        raise exception 'the key cannot be null';

    end if;

    if (in_boo_value is null) then

        raise exception 'the value cannot be null';

    end if;

    in_jsn_object = get_empty_node (in_jsn_object);

    if (in_jsn_object :: text = '{}') then

        return json_build_object (in_txt_key, in_boo_value);

    end if;

    var_boo_node = get_boolean (in_jsn_object, in_txt_key);

    if (var_boo_node is null) then

        return in_jsn_object :: jsonb || json_build_object (in_txt_key, in_boo_value) :: jsonb;

    end if;

    var_jsn_value = in_jsn_object -> in_txt_key;

    var_boo_array = (json_typeof (var_jsn_value) = 'array');

    if var_boo_array then

        perform
            1
        from
            jsonb_array_elements (var_jsn_value :: jsonb) var_tmp_element
        where
            json_typeof (var_tmp_element) != 'boolean'
        limit
            1;

        if found then

            raise exception 'the existing array contains non-boolean elements';

        end if;

        var_jsn_object = json_build_object (in_txt_key, var_jsn_value :: jsonb || to_json (in_boo_value) :: jsonb);

    else

        if json_typeof (var_jsn_value) != 'boolean' then

            raise exception 'the existing value for the key % is not boolean', in_txt_key;

        end if;

        var_jsn_object = json_build_object (in_txt_key, json_build_array (var_boo_node) || to_json (in_boo_value) :: jsonb);

    end if;

    return in_jsn_object :: jsonb || var_jsn_object :: jsonb;

end ;
$body$ language plpgsql;