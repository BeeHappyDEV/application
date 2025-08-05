export class JsonObject {

    private jsonObject: Record<string, any> = {};

    public all (): any {

        return this.jsonObject;

    }

    public del (keyString: string): void {

        delete this.jsonObject [keyString];

    }

    public empty (): boolean {

        return Object.keys (this.jsonObject).length === 0;

    }

    public get (keyString: string): any {

        return this.jsonObject [keyString];

    }

    public set (keyString: string, valueAny: any): void {

        this.jsonObject [keyString] = valueAny;

    }

    public put (jsonObject: Record<string, any>): void {

        this.jsonObject = jsonObject;

    }

    /*
    public add (keyString: string, valueObject: Object): void {

        if (!this.jsonObject.hasOwnProperty (keyString)) {

            this.jsonObject[keyString] = [valueObject];

            return;

        }

        if (!Array.isArray (this.jsonObject[keyString])) {

            this.jsonObject[keyString] = [this.jsonObject[keyString]];

        }

        this.jsonObject[keyString].push (valueObject);

    }
*/
    /*

        public toString (pretty: boolean = false): string {

            return pretty ? JSON.stringify (this.jsonObject, null, 2) : JSON.stringify (this.jsonObject);

        }
    */

}