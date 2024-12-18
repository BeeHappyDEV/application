do $$
declare
    r record;
begin
    for r in
        select
            event_object_table as table_name,
            trigger_name
        from
            information_schema.triggers
        where
            trigger_schema = current_schema ()
    loop
        execute 'drop trigger if exists ' || quote_ident (r.trigger_name) || ' on ' || quote_ident(r.table_name) || ' cascade';
    end loop;

    for r in
        select
            table_name
        from
            information_schema.tables
        where
            table_schema = current_schema ()
    loop
        execute 'drop table if exists ' || quote_ident (r.table_name) || ' cascade';
    end loop;

    for r in
        select
            sequence_name
        from
            information_schema.sequences
        where
            sequence_schema = current_schema ()
    loop
        execute 'drop sequence if exists ' || quote_ident (r.sequence_name) || ' cascade';
    end loop;

    for r in
        select
            routine_name
        from
            information_schema.routines
        where
            routine_schema = current_schema ()
    loop
        execute 'drop function if exists ' || quote_ident (r.routine_name);
    end loop;
end $$;