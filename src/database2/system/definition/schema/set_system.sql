do $$
declare
    var_record record;
begin

    perform
        pg_terminate_backend (a.pid)
    from
        pg_stat_activity a
    where
        a.datname = current_database ()
        and a.pid <> pg_backend_pid ()
        and a.usename = current_user;

    for var_record in
        select
            t.event_object_table,
            t.trigger_name
        from
            information_schema.triggers t
        where
            t.trigger_schema = current_schema ()
    loop
        begin
            execute 'drop trigger if exists ' || quote_ident (var_record.trigger_name) || ' on ' || quote_ident (var_record.event_object_table) || ' cascade';
        exception
            when others then
                raise notice 'Trigger %: %', var_record.trigger_name, sqlerrm;
        end;
    end loop;

    perform (
       with dependency_order as (
            select
                c1.relname as table_name,
                array_agg (c2.relname) as dependencies
            from
                pg_catalog.pg_class c1
                join pg_catalog.pg_depend d on c1.oid = d.refobjid
                join pg_catalog.pg_class c2 on d.objid = c2.oid
            where
                c1.relkind = 'r'
                and c2.relkind = 'r'
                and c1.relnamespace = (
                    select
                        oid
                    from
                        pg_namespace n
                    where
                        n.nspname = current_schema ()
                    )
            group by
                c1.relname
        )

        select
            string_agg ('drop table if exists ' || quote_ident (table_name) || ' cascade', '; ')
        from (
            select
                o.table_name
            from
                dependency_order o
            order by
                array_length (o.dependencies, 1) desc nulls first
        ) ordered_tables
    );

    for var_record in
        select
            s.sequence_name
        from
            information_schema.sequences s
        where
            s.sequence_schema = current_schema ()
    loop
        begin
            execute 'drop sequence if exists ' || quote_ident (var_record.sequence_name) || ' cascade';
        exception
            when others then
                raise notice 'Sequence %: %', var_record.sequence_name, sqlerrm;
        end;
    end loop;

    for var_record in
        select
            p.proname as function_name,
            n.nspname as schema_name
        from
            pg_proc p
            left join pg_namespace n on p.pronamespace = n.oid
        where
            n.nspname = current_schema ()
    loop
        begin
            execute 'drop function if exists ' || quote_ident (var_record.schema_name) || '.' || quote_ident (var_record.function_name) || ' cascade';
        exception
            when others then
                raise notice 'Function %: %', var_record.function_name, sqlerrm;
        end;
    end loop;

    for var_record in
        select
            e.extname
        from
            pg_extension e
        where
            e.extnamespace = (
                select
                    oid
                from
                    pg_namespace n
                where
                    n.nspname = current_schema ()
            )
    loop
        begin
            execute 'drop extension if exists ' || quote_ident (var_record.extname) || ' cascade';
        exception when others then
            raise notice 'Extension %: %', var_record.extname, sqlerrm;
        end;
    end loop;

    for var_record in
        select
            t.typname as type_name
        from
            pg_type t
            left join pg_namespace n on t.typnamespace = n.oid
        where
            n.nspname = current_schema ()
            and t.typrelid = 0
    loop
        begin
            execute 'drop type if exists ' || quote_ident(var_record.type_name) || ' cascade';
        exception
            when others then
                raise notice 'Type %: %', var_record.type_name, sqlerrm;
        end;
    end loop;

end $$;