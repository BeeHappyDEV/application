class JsonObject {

    private readonly jsonObject: any;

    public constructor () {

        this.jsonObject = {};

    }

    public all () {

        return this.jsonObject;

    }

    public del (keyString: String) {

        delete this.jsonObject [keyString.toString ()];

    }

    public get (keyString: String) {

        return this.jsonObject [keyString.toString ()];

    }

    public set (keyString: String, valueString: Object) {

        this.jsonObject [keyString.toString ()] = valueString;

    }

    public empty () {

        return Object.keys (this.jsonObject).length === 0;

    }

    public use () {

        return this.jsonObject ["method"];

    }

}

export default JsonObject;