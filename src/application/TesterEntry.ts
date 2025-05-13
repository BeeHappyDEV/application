import 'reflect-metadata';

import {container, inject, injectable} from 'tsyringe';

import {LangEs} from '@nlpjs/lang-es';
import {Ner} from '@nlpjs/ner';
import {Nlp} from '@nlpjs/nlp';
import {PostgresModule} from "./middleware/PostgresModule";
import {ExceptionTool} from "./toolkit/ExceptionTool";
import {JsonObject} from "./object/JsonObject";
import {ResultObject} from "./object/ResultObject";
import {LogTool} from "./toolkit/LogTool";
import {CommonsTool} from "./toolkit/CommonsTool";
import {RegistryTool} from './toolkit/RegistryTool';

interface IFlowResponse {
    action: string;
    message: string;
    nextStep?: string;
    entities?: Array<{
        entity: string;
        value: string;
    }>;
}

interface IIntent {
    name: string;
    utterances: string[];
    answers: string[];
}

interface IEntity {
    name: string;
    options: string[];
}

@injectable ()
export class TesterEntry {

    private readonly nlp: Nlp;
    private readonly ner: Ner;

    constructor (
        @inject (PostgresModule) private postgresModule: PostgresModule
    ) {
        this.ner = new Ner ({threshold: 0.8});
        this.nlp = new Nlp ({
            languages: ['es'],
            autoSave: false
        });
    }

    public async initialize (): Promise<void> {

        this.nlp.use (LangEs);

        const [entities, intents] = await Promise.all ([
            this.loadEntitiesFromDB (),
            this.loadIntentsFromDB ()
        ]);

        for (const entity of entities) {
            this.ner.addRuleOptionTexts ('es', entity.name, entity.options);
        }

        for (const intent of intents) {
            for (const utterance of intent.utterances) {
                this.nlp.addDocument ('es', utterance, intent.name);
            }
            for (const answer of intent.answers) {
                this.nlp.addAnswer ('es', intent.name, answer);
            }
        }

        const consoleLog = console.log;
        console.log = () => {
        };
        await this.nlp.train ();
        console.log = consoleLog;

    }

    private async loadEntitiesFromDB (): Promise<IEntity[]> {

        let aaa = 'SELECT e.name, array_agg(eo.option_text) as options FROM entities e JOIN entity_options eo ON eo.entity_id = e.id GROUP BY e.name';

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings);

        const paramsObject = container.resolve (JsonObject);

        let resultObject = container.resolve (ResultObject);

        try {

            paramsObject.set ('txt_content', aaa);

            resultObject = await this.postgresModule.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        return [];

    }

    private async loadIntentsFromDB (): Promise<IIntent[]> {

        let aaa = 'SELECT i.name, array_agg(DISTINCT tp.phrase) as utterances, array_agg(DISTINCT ia.answer_text) as answers FROM intents i LEFT JOIN training_phrases tp ON tp.intent_id = i.id LEFT JOIN intent_answers ia ON ia.intent_id = i.id GROUP BY i.name';

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings);

        const paramsObject = container.resolve (JsonObject);

        let resultObject = container.resolve (ResultObject);

        try {

            paramsObject.set ('txt_content', aaa);

            resultObject = await this.postgresModule.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        return [];

    }

    public async processQuestion (question: string): Promise<IFlowResponse> {

        try {

            const nlpResponse = await this.nlp.process ('es', question);

            if (!nlpResponse.intent || nlpResponse.score < 0.7) {

                return this.createFallbackResponse (question);

            }

            return this.mapResponseToFlow (nlpResponse);

        } catch (error) {

            console.error ('Error procesando pregunta:', error);

            return this.createFallbackResponse (question);

        }

    }

    private mapResponseToFlow (response: any): IFlowResponse {
        const baseResponse = {
            action: response.intent,
            message: response.answer || 'No tengo una respuesta específica para eso',
            nextStep: `handle_${response.intent}`,
            entities: response.entities?.map ((ent: any) => ({
                entity: ent.entity,
                value: ent.option
            }))
        };

        switch (response.intent) {
            case 'realizar.pedido':
                const producto = response.entities?.find ((e: any) => e.entity === 'producto');
                if (producto) {
                    return {
                        ...baseResponse,
                        message: `Has seleccionado ${producto.option}. ¿Qué modelo específico deseas?`
                    };
                }
                break;

            case 'consultar.garantia':
                return {
                    ...baseResponse,
                    nextStep: 'select_warranty_product'
                };
        }

        return baseResponse;
    }

    private createFallbackResponse (question: string): IFlowResponse {

        return {
            action: "fallback",
            message: `No estoy seguro de entender "${question}". ¿Podrías reformular tu pregunta o elegir una opción?\n\n1. Productos\n2. Garantías\n3. Realizar pedido`,
            nextStep: "await_category_selection"
        };

    }

    public async test () {

        const testCases = [
            "quiero comprar un laptop samsung",
            "qué productos tienen en stock",
            "qué cubre la garantía para smartphones",
            "cómo hago un pedido urgente",
            "que otras preguntas respondes",
            "que temperatura hay en estos instantes ",
            "que hora es",
            "cual es el estado de mi orden"
        ];

        for (const question of testCases) {

            const response = await this.processQuestion (question);

            console.log (`\nPregunta: "${question}"`);
            console.log (`Respuesta: ${response.message}`);

            if (response.entities?.length) {

                console.log (`Entidades:`, response.entities);

            }

        }

    }

}

RegistryTool.initialize ().then ();

const testerEntry = container.resolve (TesterEntry);
testerEntry.initialize ().then ();
testerEntry.test ().then ();