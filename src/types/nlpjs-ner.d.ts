// src/types/nlpjs-ner.d.ts
declare module '@nlpjs/ner' {
    import { BaseStemmer } from '@nlpjs/core';

    export interface NerOptions {
        threshold?: number;
        stemmer?: BaseStemmer;
    }

    export class Ner {
        constructor(settings?: NerOptions);
        addRuleOptionTexts(language: string, entityName: string, options: string[]): void;
        addBetweenCondition(language: string, name: string, left: string, right: string, opts?: any): void;
        addPositionCondition(language: string, name: string, position: number, words: string[]): void;
    }
}