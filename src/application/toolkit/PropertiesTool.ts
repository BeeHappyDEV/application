import fsExtra from "fs-extra";
import jsYaml from "js-yaml";

class PropertiesTool {

    public static async get (propertyString: String) {

        let fileString = "./src/configuration/config.yml";

        let yamlObject1 = jsYaml.load (fsExtra.readFileSync (fileString, "utf8"), {});

        let environmentString = process.argv [2].slice (2);

        switch (environmentString) {

            case "dev":

                fileString = "./src/configuration/config.dev.yml";

                break;

            case "qas":

                fileString = "./src/configuration/config.qas.yml";

                break;

            case "prd":

                fileString = "./src/configuration/config.prd.yml";

                break;

        }

        let yamlObject2 = jsYaml.load (fsExtra.readFileSync (fileString, "utf8"), {});

        let yamlObject = await this.mergeConfigurations (yamlObject1, yamlObject2);

        let arrayStrings: String [] = propertyString.split (".");

        let resultString;

        let keyString: String;

        for (keyString of arrayStrings) {

            if (!yamlObject || !Object.prototype.hasOwnProperty.call (yamlObject, keyString.toString ())) {

                return null;
            }

            let pairObject: any = yamlObject;

            resultString = pairObject [keyString.toString ()];

            yamlObject = pairObject [keyString.toString ()];

        }

        return resultString;

    }

    private static async mergeConfigurations (yamlObject1: any, yamlObject2: any): Promise<any> {

        for (let key in yamlObject2) {

            if (yamlObject2[key] instanceof Object && key in yamlObject1) {

                Object.assign (yamlObject2[key], await this.mergeConfigurations (yamlObject1[key], yamlObject2[key]));

            }

        }

        return {...yamlObject1, ...yamlObject2};

    }

}

export default PropertiesTool;