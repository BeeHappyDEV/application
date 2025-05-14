do $$
declare
    var_record record;
begin

    for var_record in
        select
            event_object_table as table_name,
            trigger_name
        from
            information_schema.triggers
        where
            trigger_schema = current_schema ()
    loop
        execute 'drop trigger if exists ' || quote_ident (var_record.trigger_name) || ' on ' || quote_ident(var_record.table_name) || ' cascade';
    end loop;

    for var_record in
        select
            table_name
        from
            information_schema.tables
        where
            table_schema = current_schema ()
    loop
        execute 'drop table if exists ' || quote_ident (var_record.table_name) || ' cascade';
    end loop;

    for var_record in
        select
            sequence_name
        from
            information_schema.sequences
        where
            sequence_schema = current_schema ()
    loop
        execute 'drop sequence if exists ' || quote_ident (var_record.sequence_name) || ' cascade';
    end loop;

    for var_record in
        select
            routine_name
        from
            information_schema.routines
        where
            routine_schema = current_schema ()
    loop
        execute 'drop function if exists ' || quote_ident (var_record.routine_name);
    end loop;

    for var_record in
        select
            schema_name
        from
            information_schema.schemata
        where
            schema_owner = 'postgres'
    loop
        execute 'drop schema if exists ' || quote_ident (var_record.schema_name) || ' cascade';
    end loop;

end $$;