drop function if exists framework.set_array;

create or replace function framework.set_array (
    in in_jsn_object json,
    in in_txt_key text,
    in in_jsn_value json
)
returns json as $body$
declare
    var_jsn_current jsonb;
    var_jsn_result jsonb;
begin

    var_jsn_result = framework.get_empty_node (in_jsn_object);

    var_jsn_current = var_jsn_result -> in_txt_key;

    if (var_jsn_result = '{}' :: jsonb or var_jsn_current is null) then

       return (var_jsn_result || jsonb_build_object (in_txt_key, jsonb_build_array (in_jsn_value))) :: json;

    elsif (jsonb_typeof (var_jsn_current) = 'array') then

        return jsonb_set (var_jsn_result, array [in_txt_key], var_jsn_current || in_jsn_value :: jsonb) :: json;

    else

        raise exception '';

    end if;

end ;
$body$ language plpgsql;