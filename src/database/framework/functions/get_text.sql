drop function if exists framework.get_text;

create or replace function framework.get_text (
    in in_jsn_object json,
    in in_txt_key text
)
returns text as $body$
declare
    var_jsn_value jsonb;
begin

    var_jsn_value = (in_jsn_object :: jsonb -> in_txt_key);

    if (var_jsn_value is null or jsonb_typeof (var_jsn_value) = 'null') then

        return null;

    elseif (jsonb_typeof (var_jsn_value) = 'string') then

        return var_jsn_value #>> '{}';

    elseif (jsonb_typeof (var_jsn_value) = 'array') then

        return var_jsn_value :: json;

    else

        return var_jsn_value #>> '{}';

    end if;

end;
$body$ language plpgsql;