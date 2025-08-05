drop function if exists framework.get_numeric;

create or replace function framework.get_numeric (
    in in_jsn_object json,
    in in_txt_key text
)
returns numeric as $body$
declare
    var_jsn_value jsonb;
begin

    var_jsn_value = (in_jsn_object :: jsonb -> in_txt_key);

    if (var_jsn_value is null or jsonb_typeof (var_jsn_value) = 'null') then

        return null;

    elseif (jsonb_typeof (var_jsn_value) = 'number') then

        return var_jsn_value #>> '{}';

    elseif (jsonb_typeof (var_jsn_value) = 'array') then

        return var_jsn_value :: json;

    else

        return var_jsn_value #>> '{}';

    end if;

end;
$body$ language plpgsql;