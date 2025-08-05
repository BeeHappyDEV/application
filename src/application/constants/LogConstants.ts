export class LogConstants {

    public static OK: string = 'OK';
    public static NOK: string = 'NOK';
    public static ERR: string = 'ERR';
    public static DBG: string = 'DBG';

    public static OK_EXECUTE: Record<string, any> = {event: 11, message: null};
    public static NOK_EXECUTE: Record<string, any> = {event: 12, message: null};
    public static ERR_EXECUTE: Record<string, any> = {event: 13, message: null};
    public static DBG_INITIALIZE: Record<string, any> = {event: 14, message: 'Initialize'};
    public static DBG_FINALIZE: Record<string, any> = {event: 15, message: 'Finalize'};

    public static SCP_EXECUTE: Record<string, any> = {event: 21, message: 'Execute'};
    public static SCP_SUCCESS: Record<string, any> = {event: 22, message: 'Success'};
    public static SCP_POSTGRES: Record<string, any> = {event: 23, message: 'Postgres Exception'};

    public static FNC_EXECUTE: Record<string, any> = {event: 31, message: 'Execute'};
    public static FNC_SUCCESS: Record<string, any> = {event: 32, message: 'Success'};
    public static FNC_FUNCTION: Record<string, any> = {event: 33, message: 'Function Exception'};
    public static FNC_POSTGRES: Record<string, any> = {event: 34, message: 'Postgres Exception'};

    public static WSV_EXECUTE: Record<string, any> = {event: 41, message: 'Execute'};
    public static WSV_SUCCESS: Record<string, any> = {event: 42, message: 'Success'};
    public static WSV_WEBSERVICE: Record<string, any> = {event: 43, message: 'Webservice Exception'};







    public static EXECUTE: Record<string, any> = {txt_exception: 'Execute'};
    public static SUCCESS: Record<string, any> = {num_exception: 0, txt_exception: 'Success'};
    public static SCRIPT: Record<string, any> = {num_exception: 22, txt_exception: 'Script Exception'};
    public static FUNCTION: Record<string, any> = {num_exception: 23, txt_exception: 'Function Exception'};
    public static POSTGRES: Record<string, any> = {num_exception: 21, txt_exception: 'Postgres Exception'};

    public static FAILED: Record<string, any> = {num_exception: 0, txt_exception: 'Failed'};

    public static SERVICE: Record<string, any> = {num_exception: 12, txt_exception: 'Service Exception'};

    public static CONTROLLER: Record<string, any> = {num_exception: 11, txt_exception: 'Controller Exception'};
    public static WEBSERVICE: Record<string, any> = {num_exception: 21, txt_exception: 'Webservice Exception'};
    public static INDICATOR: Record<string, any> = {num_exception: 32, txt_exception: 'Indicators Exception'};

}