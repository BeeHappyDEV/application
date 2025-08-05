drop function if exists framework.get_empty_node;

create or replace function framework.get_empty_node (
    in in_jsn_object json
)
returns json as $body$
begin

    return coalesce (nullif (in_jsn_object :: text, '') :: json, '{}' :: json);

end;
$body$ language plpgsql;