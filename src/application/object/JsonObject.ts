export class JsonObject {

    private readonly jsonObject: any = null;

    public constructor () {

        this.jsonObject = {};

    }

    public all (): any {

        return this.jsonObject;

    }

    public del (keyString: string): void {

        delete this.jsonObject [keyString];

    }

    public get (keyString: string): any {

        return this.jsonObject [keyString];

    }

    public set (keyString: string, valueObject: Object): void {

        this.jsonObject [keyString] = valueObject;

    }

    public empty () {

        return Object.keys (this.jsonObject).length === 0;

    }

}