import {inject, injectable} from 'tsyringe';

import fsExtra from 'fs-extra';
import natural from 'natural';
import path from 'path';

import {PropertiesTool} from '../toolkit/PropertiesTool';
import {CommonsTool} from "../toolkit/CommonsTool";
import {LogTool} from "../toolkit/LogTool";

@injectable ()
export class NaturalModule {

    private bayesClassifier: natural.BayesClassifier = new natural.BayesClassifier ();
    private initializedBoolean = false;
    private intentRecord: Record<string, any> = {};
    private intentRecordArray: any [] = [];
    private stopWords!: Set<string>;
    private wordTokenizer: natural.WordTokenizer;

    constructor (
        @inject ('LogToolFactory') private logToolFactory: () => LogTool,
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

    public async getIntent (preprocessedString: string): Promise<Record<string, any>> {

        const responseRecord: Record<string, any> = {};

        const processedString = await this.processString (preprocessedString);

        const apparatusClassificationArray = this.bayesClassifier.getClassifications (processedString);

        const totalNumber = apparatusClassificationArray.reduce ((summatoryNumber, apparatusClassification) => summatoryNumber + Math.exp (apparatusClassification.value), 0);

        const [apparatusClassification] = apparatusClassificationArray
            .map (apparatusClassification => ({
                label: apparatusClassification.label,
                confidence: Math.exp (apparatusClassification.value) / totalNumber
            }))
            .sort ((a, b) => b.confidence - a.confidence);

        const intentRecord = this.intentRecordArray.find (obj => obj.intent === apparatusClassification.label);

        responseRecord.preprocessed = preprocessedString;
        responseRecord.processed = await this.processString (preprocessedString);
        responseRecord.intent = apparatusClassification.label;
        responseRecord.confidence = (apparatusClassification.confidence * 100).toFixed (1);
        responseRecord.actions = intentRecord.actions
        responseRecord.responses = intentRecord.responses;

        return responseRecord;

    }


    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    private async readIntentDirectories (): Promise<void> {

        this.intentRecord = {};

        this.intentRecordArray = [];

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

                    let intentRecord = await this.readIntentFile (rootString, domainDirent.name, scopeDirent.name, intentDirent);

                    if (intentRecord.intent === 'default') {

                        this.intentRecord = intentRecord;

                    } else {

                        this.intentRecordArray.push (intentRecord);

                    }

                }
            }

        }

    }

    private async readIntentFile (rootString: string, domainString: string, scopeString: string, intentString: string): Promise<any> {

        const sourceString = path.join (rootString, domainString, scopeString, intentString);

        const contentString = fsExtra.readFileSync (sourceString, 'utf-8');

        const intentRecord = JSON.parse (contentString);
        intentRecord.domain = domainString;
        intentRecord.scope = scopeString;
        intentRecord.intent = path.parse (intentString).name;

        if (intentRecord.utterances && intentRecord.utterances.length > 0) {

            for (const utteranceRecord of intentRecord.utterances) {

                utteranceRecord.object = CommonsTool.getMD5 (utteranceRecord.message);

            }

        }

        if (intentRecord.responses && intentRecord.responses.length > 0) {

            for (const responseRecord of intentRecord.responses) {

                responseRecord.object = CommonsTool.getMD5 (responseRecord.message);

            }

        }

        fsExtra.writeFileSync (sourceString, JSON.stringify (intentRecord, null, 4), 'utf-8');

        return intentRecord;

    }

    private async trainModel (): Promise<void> {

        this.bayesClassifier = new natural.BayesClassifier ();

        for (const intentRecord of this.intentRecordArray) {

            if (!intentRecord.utterances || intentRecord.utterances.length === 0) {

                continue;

            }

            for (const utteranceRecord of intentRecord.utterances) {

                const processedString = await this.processString (utteranceRecord.message);

                if (processedString) {

                    this.bayesClassifier.addDocument (processedString, intentRecord.intent);

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