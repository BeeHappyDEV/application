drop function if exists framework.set_text;

create or replace function framework.set_text (
    in in_jsn_object json,
    in in_txt_key text,
    in in_txt_value text
)
returns json as $body$
declare
    var_jsn_current jsonb;
    var_jsn_result jsonb;
    var_txt_current text;
begin

    var_jsn_result := framework.get_empty_node (in_jsn_object) :: jsonb;

    var_jsn_current := var_jsn_result -> in_txt_key;

    if (var_jsn_result = '{}' :: jsonb or var_jsn_current is null) then

        var_jsn_result := var_jsn_result || jsonb_build_object (in_txt_key, to_jsonb (in_txt_value));

    elsif (jsonb_typeof (var_jsn_current) = 'array') then

        perform
            1
        from
            jsonb_array_elements (var_jsn_current) "obj_element"
        where
            jsonb_typeof (obj_element) not in ('string')
        limit
            1;

        if found then

            raise exception '';

        end if;

        var_jsn_result := jsonb_set (var_jsn_result, array [in_txt_key], var_jsn_current || to_jsonb (in_txt_value));

    elsif (jsonb_typeof (var_jsn_current) = 'string') then

        var_txt_current := var_jsn_current #>> '{}';

        var_jsn_result := var_jsn_result - in_txt_key || jsonb_build_object (in_txt_key, jsonb_build_array (var_txt_current, in_txt_value));

    else

        raise exception '';

    end if;

    return var_jsn_result :: json;

end;
$body$ language plpgsql;