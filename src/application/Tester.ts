import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {Client as PgClient} from 'pg';
import {PageParams} from "@supabase/auth-js/src/lib/types";


export class Testing {
    private functionClient: SupabaseClient;
    //private scriptClient: SupabaseClient;
    private pgClient: PgClient;

    constructor () {
        const host = 'https://kmvzmtoxdtnjjbhgfamt.supabase.co';
        //const publicKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttdnptdG94ZHRuampiaGdmYW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MDE4ODgsImV4cCI6MjA0OTk3Nzg4OH0.kte43mgxqODXQA5sV1nvtpsOXddCNDKneBLu3nPqYIU';
        const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttdnptdG94ZHRuampiaGdmYW10Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDQwMTg4OCwiZXhwIjoyMDQ5OTc3ODg4fQ.0HlJmFmme5S9H8VzCMCFOGmWYTvSorZYhAm8sqp8JBE';

        //this.functionClient = createClient (host, publicKey);
        this.functionClient = createClient (host, serviceKey);
        //this.scriptClient = createClient(host, serviceKey);

        this.pgClient = new PgClient ({
            host: 'aws-0-us-west-1.pooler.supabase.com',
            port: 6543,
            user: 'postgres.kmvzmtoxdtnjjbhgfamt',
            password: 'beehappydev',
            database: 'postgres',
            ssl: {rejectUnauthorized: false},
        });
    }

    public async initialize (): Promise<void> {
        await this.testFunction ();

        try {
            await this.pgClient.connect ();
            console.log ('🟢 Conexión a PostgreSQL exitosa');

            // Ejecutar funciones o scripts
            // await this.testScript();

        } catch (error) {
            console.error ('🔴 Error al conectar a PostgreSQL:', error);
        } finally {
            await this.pgClient.end ();
            console.log ('🔌 Conexión a PostgreSQL cerrada');
        }
    }

    public async testFunction (): Promise<boolean> {
        try {

            //let result = await this.functionClient.from ('dat_communes').select ('*');

            let result = await this.functionClient.rpc('get_user_by_email', {
                p_email: '56991220195@user.beehappy.dev'
            });

            console.log (result.data);

            //result = await this.functionClient.from ('auth.users').select ('*');
            let result2 = await this.functionClient.auth.admin.listUsers();

            console.log (result2.data);

            const targetUser = result2.data.users.find(u => u.email === '56991220195@user.beehappy.dev');

            console.log (targetUser);


            await this.functionClient.auth.getUser ();

            // @ts-ignore
            result2 = await this.functionClient.auth.admin.listUsers({
                page: 1,
                perPage: 1,
                filter: `email.eq.'56991220195@user.beehappy.dev'`
            } as PageParams & { filter?: string });

            console.log (result2.data);

            /*
            { data, error } = await this.functionClient.rpc('frontend_page_action', {
                in_jsn_incoming: { txt_action: 'landing' },
            });
*/
/*
            if (error) {
                console.error ('⚠️ Error al ejecutar RPC:', error);
                return false;
            }

            console.log ('✅ Resultado de RPC:', data);

 */
            return true;
        } catch (err) {
            console.error ('❌ Error inesperado en testFunction:', err);
            return false;
        }
    }

}

// Ejecutar
new Testing ().initialize ().then ();