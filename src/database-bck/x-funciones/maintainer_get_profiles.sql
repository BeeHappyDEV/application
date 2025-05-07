drop function if exists maintainer_get_profiles;

create or replace function maintainer_get_profiles (
    in incoming_object json
)
returns json as $body$
declare
    var_obj_profile json;
    var_obj_profiles json;
    var_rec_profiles record;
begin

    for var_rec_profiles in
        select
            idf_profile,
            txt_profile
        from
            dat_profiles prf
        order by
            prf.idf_profile
    loop

        select
            row_to_json (returned)
        into
            var_obj_profile
        from (
            select
                var_rec_profiles.idf_profile,
                var_rec_profiles.txt_profile
        ) returned;

        var_obj_profiles = core_set_json_json (var_obj_profiles, 'obj_profiles', var_obj_profile);

    end loop;

    incoming_object = core_set_json_json (incoming_object, 'obj_profiles', var_obj_profiles);

    return incoming_object;

end;
$body$ language plpgsql;