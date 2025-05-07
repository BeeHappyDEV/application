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

end $$;

/*
do $$
declare
    var_record record;
    var_sessions int;
begin
    -- 1. desconectar todas las conexiones activas para evitar bloqueos
    select
        count (*)
    into
        active_sessions
    from
        pg_stat_activity
    where
        datname = current_database ()
    and
        pid <> pg_backend_pid ();

    if active_sessions > 0 then

        raise notice 'desconectando % sesiones activas', active_sessions;

        perform
            pg_terminate_backend (pid)
        from
            pg_stat_activity
        where
            datname = current_database ()
        and
            pid <> pg_backend_pid ();
    end if;

    -- 2. eliminar triggers con manejo seguro de errores
    for var_record in
        select
            event_object_table as table_name,
            trigger_name
        from
            information_schema.triggers
        where
            trigger_schema = current_schema()
    loop
        begin
            execute 'drop trigger if exists ' || quote_ident(r.trigger_name) ||
                    ' on ' || quote_ident(r.table_name) || ' cascade';
        exception when others then
            raise notice 'error eliminando trigger %: %', r.trigger_name, sqlerrm;
        end;
    end loop;

    -- 3. eliminar tablas en orden seguro (primero las que tienen fks)
    perform (
        with dependency_order as (
            select
                tbl.relname as table_name,
                array_agg(dep.relname) as dependencies
            from
                pg_catalog.pg_class tbl
                join pg_catalog.pg_depend dep on tbl.oid = dep.refobjid
                join pg_catalog.pg_class depclass on dep.objid = depclass.oid
            where
                tbl.relkind = 'r'
                and depclass.relkind = 'r'
                and tbl.relnamespace = (select oid from pg_namespace where nspname = current_schema())
            group by tbl.relname
        )
        select string_agg('drop table if exists ' || quote_ident(table_name) || ' cascade', '; ')
        from (
            select table_name
            from dependency_order
            order by array_length(dependencies, 1) desc nulls first
        ) ordered_tables
    );

    -- 4. eliminar secuencias
    for var_record in
        select
            sequence_name
        from
            information_schema.sequences
        where
            sequence_schema = current_schema()
    loop
        begin
            execute 'drop sequence if exists ' || quote_ident(r.sequence_name) || ' cascade';
        exception when others then
            raise notice 'error eliminando secuencia %: %', r.sequence_name, sqlerrm;
        end;
    end loop;

    -- 5. eliminar funciones con dependencias
    for var_record in
        select
            p.proname as function_name,
            n.nspname as schema_name
        from
            pg_proc p
            left join pg_namespace n on p.pronamespace = n.oid
        where
            n.nspname = current_schema()
    loop
        begin
            execute 'drop function if exists ' || quote_ident(r.schema_name) || '.' ||
                    quote_ident(r.function_name) || ' cascade';
        exception when others then
            raise notice 'error eliminando función %: %', r.function_name, sqlerrm;
        end;
    end loop;

    -- 6. eliminar extensiones (opcional, si es necesario)
    for var_record in
        select extname
        from pg_extension
        where extnamespace = (select oid from pg_namespace where nspname = current_schema())
    loop
        begin
            execute 'drop extension if exists ' || quote_ident(r.extname) || ' cascade';
        exception when others then
            raise notice 'error eliminando extensión %: %', r.extname, sqlerrm;
        end;
    end loop;

    -- 7. eliminar tipos personalizados
    for r in
        select t.typname as type_name
        from pg_type t
        left join pg_namespace n on t.typnamespace = n.oid
        where n.nspname = current_schema()
        and t.typrelid = 0  -- no tipos compuestos
    loop
        begin
            execute 'drop type if exists ' || quote_ident(r.type_name) || ' cascade';
        exception when others then
            raise notice 'error eliminando tipo %: %', r.type_name, sqlerrm;
        end;
    end loop;
end $$;
*/