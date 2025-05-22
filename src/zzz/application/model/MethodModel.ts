export interface MethodModel {
    name: string;
    isPublic: boolean;
    parameters: string[];
    returnType: string;
    calls: MethodCall[];
    postgresCalls: PostgresCall[];
    webServiceCalls: WebServiceCall[];
    code: string;
}

export interface MethodCall {
    className: string;
    methodName: string;
    domain: string;
}

export interface PostgresCall {
    schema: string;
    functionName: string;
}

export interface WebServiceCall {
    method: string;
    configKey: string;
}