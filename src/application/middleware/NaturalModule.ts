import {inject, injectable} from 'tsyringe';

import fsExtra from 'fs-extra';
import natural from 'natural';
import path from 'path';

import {PropertiesTool} from '../toolkit/PropertiesTool';
import {ApparatusClassification} from "natural";

@injectable ()
export class NaturalModule {

    private bayesClassifier!: natural.BayesClassifier;
    private initializedBoolean = false;
    private intentObject: any = {};
    private intentObjectArray: any [] = [];
    private stemmer: natural.Stemmer;
    private stopWords: Set<string>;
    private wordTokenizer: natural.WordTokenizer;

    constructor (
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {

        this.wordTokenizer = new natural.WordTokenizer ();
        this.stemmer = natural.PorterStemmerEs;
        this.stopWords = new Set ([...natural.stopwords]);

    }

    public async initialize (): Promise<void> {

        if (this.initializedBoolean) {

            return;

        }

        try {

            await this.readIntentFiles ();

            await this.trainModel ();

            this.initializedBoolean = true;

        } catch (error) {

            this.initializedBoolean = false;

        }

        //await this.testPhrases ();

    }

    public async isInitialized (): Promise<boolean> {

        return this.initializedBoolean;

    }

    public async getResponse (phrase: string): Promise<string> {

        const processedPhrase = this.preprocessText (phrase);

        const apparatusClassificationArray: natural.ApparatusClassification [] = this.bayesClassifier.getClassifications (processedPhrase);

        if (apparatusClassificationArray.length === 0) {

            return this.getDefaultResponse ();

        }

        const total = apparatusClassificationArray.reduce ((sum, apparatusClassification: ApparatusClassification) => sum + Math.exp (apparatusClassification.value), 0);

        const [topIntent] = apparatusClassificationArray
            .map (apparatusClassification => ({
                label: apparatusClassification.label,
                confidence: Math.exp (apparatusClassification.value) / total
            }))
            .sort ((a, b) => b.confidence - a.confidence);

        // 3. Logging de diagnóstico
        console.log (`Frase: "${phrase}"`);
        console.log (`Intención detectada: ${topIntent.label} (${(topIntent.confidence * 100).toFixed (1)}% confianza)`);

        // 4. Búsqueda de la respuesta
        const intentParts = topIntent.label.split ('.');
        const intentObject = this.intentObjectArray.find (obj =>
            obj.domain === intentParts[0] &&
            obj.scope === intentParts[1] &&
            obj.intent === intentParts[2]
        );

        // 5. Retorno de respuesta aleatoria o default
        if (intentObject?.responses?.length) {
            const response = this.getRandomResponse (intentObject.responses);
            console.log (`Respuesta: ${response}`);
            return response;
        }

        return this.getDefaultResponse ();

    }

    private getDefaultResponse (): string {

        if (!this.intentObject?.responses?.length) return '';

        const response = this.getRandomResponse (this.intentObject.responses);

        console.log (`Respuesta (default): ${response}`);

        return response;

    }

    private getRandomResponse (responses: string[]): string {

        return responses [Math.floor (Math.random () * responses.length)];

    }

    private async readIntentFiles (): Promise<void> {

        this.intentObject = null;
        this.intentObjectArray = [];

        const rootString = await this.propertiesTool.get ('integration.natural.root');

        const domainDirentArray = fsExtra.readdirSync (rootString, {withFileTypes: true})
            .filter (direntString => direntString.isDirectory ())
            .sort ((aDirentString, bDirentString) => aDirentString.name.localeCompare (bDirentString.name));

        for (const domainDirent of domainDirentArray) {

            const domainString = path.join (rootString, domainDirent.name);

            const scopeDirentArray = fsExtra.readdirSync (domainString, {withFileTypes: true})
                .filter (direntString => direntString.isDirectory ())
                .sort ((aDirentString, bDirentString) => aDirentString.name.localeCompare (bDirentString.name));

            for (const scopeDirent of scopeDirentArray) {

                const scopeString = path.join (domainString, scopeDirent.name);

                const fileDirentArray = fsExtra.readdirSync (scopeString)
                    .filter (fileString => path.extname (fileString).toLowerCase () === '.json')
                    .sort ((aFileString, bFileString) => aFileString.localeCompare (bFileString));

                for (const fileDirent of fileDirentArray) {

                    if (path.extname (fileDirent).toLowerCase () === '.json') {

                        const jsonString = path.join (scopeString, fileDirent);

                        const contentString = fsExtra.readFileSync (jsonString, 'utf-8');

                        const contentObject = JSON.parse (contentString);
                        contentObject.domain = domainDirent.name;
                        contentObject.scope = scopeDirent.name;

                        if (contentObject.intent === 'default') {

                            this.intentObject = contentObject;

                        } else {

                            this.intentObjectArray.push (contentObject);

                        }

                    }

                }

            }

        }

    }

    private async trainModel () {

        this.bayesClassifier = new natural.BayesClassifier ();

        for (const intentObject of this.intentObjectArray) {

            const intentString = intentObject.domain + '.' + intentObject.scope + '.' + intentObject.intent;

            for (const utteranceString of intentObject.utterances) {

                const processedText = this.preprocessText (utteranceString);

                if (processedText) {

                    this.bayesClassifier.addDocument (processedText, intentString);

                }

            }

        }

        this.bayesClassifier.train ();

    }

    private preprocessText (text: string): string {
        if (!text || typeof text !== 'string') return '';

        // 1. Normalización básica
        let processed = text.toLowerCase ()
            .replace (/[^\w\sáéíóúüñÁÉÍÓÚÜÑ]/g, ' ') // Conserva acentos
            .replace (/\s+/g, ' ')
            .trim ();

        // 2. Tokenización y filtrado
        const tokens = this.wordTokenizer.tokenize (processed) || [];

        return tokens
            .filter (token => token.length > 2)
            .filter (token => !this.stopWords.has (token))
            .map (token => this.stemmer.stem (token))
            .join (' ');
    }
/*
    private async testPhrases (): Promise<void> {

        await this.getResponse ("cuanto debo este mes");
        console.log ('E: ' + 'consultar_deuda');
        console.log ();

        await this.getResponse ("quien es mi agente de cuentas");
        console.log ('E: ' + 'consultar_ejecutivo');
        console.log ();

        await this.getResponse ("a que hora cierran la oficina");
        console.log ('E: ' + 'consultar_horario');
        console.log ();

        await this.getResponse ("necesito el correo de soporte");
        console.log ('E: ' + 'consultar_contacto');
        console.log ();

        await this.getResponse ("hola que tal");
        console.log ('E: ' + 'saludar');
        console.log ();

        await this.getResponse ("háblame del clima en la luna");
        console.log ('E: ' + 'default');

        console.log(CommonsTool.getBase62(7));
        console.log(CommonsTool.getBase62(7));
        console.log(CommonsTool.getBase62(7));
        console.log(CommonsTool.getBase62(7));
        console.log(CommonsTool.getBase62(7));
        console.log(CommonsTool.getBase62(7));
        console.log(CommonsTool.getBase62(7));
        console.log(CommonsTool.getBase62(7));
        console.log(CommonsTool.getBase62(7));
        console.log(CommonsTool.getBase62(7));

        await this.getResponse ("tienes el telefono del ejecutivo?");
        console.log ('E: ' + 'saludar');

    }
*/
}