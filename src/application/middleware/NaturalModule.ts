import {inject, injectable} from 'tsyringe';

import fsExtra from 'fs-extra';
import natural from 'natural';
import path from 'path';

import {PropertiesTool} from '../toolkit/PropertiesTool';

@injectable ()
export class NaturalModule {

    private bayesClassifier: natural.BayesClassifier = new natural.BayesClassifier ();
    private initializedBoolean = false;
    private intentObject: any = null;
    private intentObjectArray: any[] = [];
    private stopWords!: Set<string>;
    private wordTokenizer: natural.WordTokenizer;

    constructor (
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {

        this.wordTokenizer = new natural.WordTokenizer ();

    }

    public async initialize (): Promise<void> {

        this.stopWords = new Set ([
            ...natural.stopwords,
            await this.propertiesTool.get ('stopWords')
        ]);

        if (this.initializedBoolean) {

            return;

        }

        await this.readIntentDirectories ();

        await this.trainModel ();

        this.initializedBoolean = true;

    }

    public async isInitialized (): Promise<boolean> {

        return this.initializedBoolean;

    }

    public async getResponse (preprocessedString: string): Promise<Record<string, any>> {

        const responseObject: Record<string, any> = {};

        const processedString = await this.processString (preprocessedString);

        const apparatusClassificationArray = this.bayesClassifier.getClassifications (processedString);

        if (!apparatusClassificationArray || apparatusClassificationArray.length === 0) {

            responseObject.preprocessed = preprocessedString;
            responseObject.processed = await this.processString (preprocessedString);
            responseObject.confidence = 0;
            responseObject.response = this.selectRandomResponse (this.intentObject.responses);

            return responseObject;

        }

        const totalNumber = apparatusClassificationArray.reduce ((summatoryNumber, apparatusClassification) => summatoryNumber + Math.exp (apparatusClassification.value), 0);

        const [apparatusClassification] = apparatusClassificationArray
            .map (apparatusClassification => ({
                label: apparatusClassification.label,
                confidence: Math.exp (apparatusClassification.value) / totalNumber
            }))
            .sort ((a, b) => b.confidence - a.confidence);

        const intentObject = this.intentObjectArray.find (obj => obj.intent === apparatusClassification.label);

        responseObject.preprocessed = preprocessedString;
        responseObject.processed = await this.processString (preprocessedString);
        responseObject.intent = apparatusClassification.label;
        responseObject.confidence = (apparatusClassification.confidence * 100).toFixed (1);
        responseObject.response = this.selectRandomResponse (intentObject.responses);
        responseObject.actions = intentObject.actions

        return responseObject;

    }

    private selectRandomResponse (responseObjectArray: any []): string {

        const randomNumber = Math.floor (Math.random () * responseObjectArray.length);

        return responseObjectArray [randomNumber];

    }

    private async readIntentDirectories (): Promise<void> {

        this.intentObject = null;

        this.intentObjectArray = [];

        const rootString = await this.propertiesTool.get ('integration.natural.root');

        const domainDirentArray = fsExtra.readdirSync (rootString, {withFileTypes: true})
            .filter (direntString => direntString.isDirectory ())
            .sort ((a, b) => a.name.localeCompare (b.name));

        for (const domainDirent of domainDirentArray) {

            const domainString = path.join (rootString, domainDirent.name);

            const scopeDirentArray = fsExtra.readdirSync (domainString, {withFileTypes: true})
                .filter (direntString => direntString.isDirectory ())
                .sort ((a, b) => a.name.localeCompare (b.name));

            for (const scopeDirent of scopeDirentArray) {

                const scopeString = path.join (domainString, scopeDirent.name);

                const intentDirentArray = fsExtra.readdirSync (scopeString)
                    .filter (fileString => path.extname (fileString).toLowerCase () === '.json')
                    .sort ((a, b) => a.localeCompare (b));

                for (const intentDirent of intentDirentArray) {

                    let intentObject = await this.readIntentFile (rootString, domainDirent.name, scopeDirent.name, intentDirent);

                    if (intentObject.intent === 'default') {

                        this.intentObject= intentObject;

                    } else {

                        this.intentObjectArray.push (intentObject);

                    }

                }
            }

        }

    }

    private async readIntentFile (rootString: string, domainString: string, scopeString: string, intentString: string): Promise<any> {

        const sourceString = path.join (rootString, domainString, scopeString, intentString);

        const contentString = fsExtra.readFileSync (sourceString, 'utf-8');

        const intentObject = JSON.parse (contentString);
        intentObject.domain = domainString;
        intentObject.scope = scopeString;
        intentObject.intent = path.parse (intentString).name;

        let offsetNumber = 0;

        for (const responseObject of intentObject.responses) {

            responseObject.identifier = ++offsetNumber;

        }

        fsExtra.writeFileSync (sourceString, JSON.stringify (intentObject, null, 4), 'utf-8');

        return intentObject;

    }

    private async trainModel (): Promise<void> {

        this.bayesClassifier = new natural.BayesClassifier ();

        for (const intentObject of this.intentObjectArray) {

            if (!intentObject.utterances || intentObject.utterances.length === 0) {

                continue;

            }

            for (const utteranceString of intentObject.utterances) {

                const processedString = await this.processString (utteranceString);

                if (processedString) {

                    this.bayesClassifier.addDocument (processedString, intentObject.intent);

                }

            }

        }

        this.bayesClassifier.train ();

    }

    private async processString (preprocessedString: string): Promise<string> {

        let processedString = preprocessedString.toLowerCase ()
            .normalize ('NFD').replace (/[\u0300-\u036f]/g, '')
            .replace (/[^\w\s]/g, ' ')
            .replace (/\s+/g, ' ')
            .trim ();

        const tokenStringArray = this.wordTokenizer.tokenize (processedString) || [];

        processedString = tokenStringArray
            .filter (tokenString => tokenString.length > 2)
            .filter (tokenString => !this.stopWords.has (tokenString))
            .join (' ');

        return processedString;

    }

}