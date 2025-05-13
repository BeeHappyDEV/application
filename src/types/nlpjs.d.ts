// src/types/nlpjs.d.ts
declare module '@nlpjs/core' {
    export interface NlpSettings {
        languages?: string[];
        autoSave?: boolean;
        nlu?: { log?: boolean };
    }

    export interface Ner {
        addRuleOptionTexts(language: string, entityName: string, options: string[]): void;
    }

    export class Nlp {
        constructor(settings?: NlpSettings);
        use(plugin: any): void;
        addDocument(language: string, utterance: string, intent: string): void;
        addAnswer(language: string, intent: string, answer: string): void;
        train(): Promise<void>;
        process(language: string, utterance: string): Promise<NlpResult>;
        getNer(): Ner;
    }

    export interface NlpResult {
        intent: string;
        score: number;
        answer?: string;
        entities?: Array<{
            entity: string;
            option: string;
            sourceText: string;
            utteranceText: string;
        }>;
    }
}

declare module '@nlpjs/lang-es' {
    export class LangEs {
        constructor(settings?: any);
    }
}

declare module '@nlpjs/nlp' {
    export { Nlp } from '@nlpjs/core';
}