import { singleton } from "tsyringe";
import fsExtra from "fs-extra";
import jsYaml from "js-yaml";

@singleton()
export class PropertiesTool {
    private properties: any = {};
    private loaded = false;

    public async load(): Promise<void> {
        try {
            let fileString = "./src/configuration/config.yml";
            const environmentString = process.argv[2]?.slice(2) || 'dev';

            // Cargar configuración base
            const yamlObject1 = jsYaml.load(fsExtra.readFileSync(fileString, "utf8"), {});

            // Cargar configuración específica del entorno
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

            const yamlObject2 = jsYaml.load(fsExtra.readFileSync(fileString, "utf8"), {});
            this.properties = this.deepMerge(yamlObject1, yamlObject2);
            this.loaded = true;
        } catch (error) {
            console.error('Error loading properties:', error);
            this.properties = {};
            this.loaded = false;
            throw error;
        }
    }

    private deepMerge(target: any, source: any): any {
        if (typeof target !== 'object' || typeof source !== 'object') {
            return source;
        }

        const result = { ...target };
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (target.hasOwnProperty(key)) {
                    result[key] = this.deepMerge(target[key], source[key]);
                } else {
                    result[key] = source[key];
                }
            }
        }
        return result;
    }

    public async get(propertyString: string, defaultValue: any = null): Promise<any> {
        if (!this.loaded) {
            await this.load();
        }

        // Primero verifica variables de entorno
        const envKey = propertyString.toUpperCase().replace(/\./g, '_');
        if (process.env[envKey] !== undefined) {
            return this.parseValue(process.env[envKey]);
        }

        // Luego verifica propiedades cargadas
        const keys = propertyString.split('.');
        let value = this.properties;

        for (const key of keys) {
            if (!value || typeof value !== 'object' || !value.hasOwnProperty(key)) {
                return defaultValue;
            }
            value = value[key];
        }

        return value !== undefined ? value : defaultValue;
    }

    public async require(propertyString: string): Promise<any> {
        const value = await this.get(propertyString);
        if (value === null || value === undefined) {
            throw new Error(`Required property ${propertyString} is not defined`);
        }
        return value;
    }

    private parseValue(value: string): any {
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
        if (!isNaN(Number(value))) return Number(value);
        return value;
    }
}