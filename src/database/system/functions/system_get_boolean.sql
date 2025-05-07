drop function if exists system_get_boolean;

create or replace function system_get_boolean (
    in in_jsn_object json,
    in in_txt_key text
)
returns boolean as $body$
declare
    var_jsn_value json;
    var_boo_value boolean;
begin

    if (in_jsn_object is null) then

        return null;

    end if;

    if (in_txt_key is null) then

        raise exception 'the key cannot be null';

    end if;

    var_jsn_value = in_jsn_object -> in_txt_key;

    if (var_jsn_value is null or json_typeof (var_jsn_value) = 'null') then

        return null;

    end if;

    case json_typeof (var_jsn_value)

        when 'array' then

            select
                var_tmp_element :: boolean
            into
                var_boo_value
            from
                jsonb_array_elements (var_jsn_value :: jsonb) var_tmp_element
            where
                json_typeof (var_tmp_element) = 'boolean'
            limit
                1;

            return var_boo_value;

        when 'boolean' then

            return var_jsn_value #>> '{}' :: boolean;

        else

            return null;

    end case;

end;
$body$ language plpgsql;