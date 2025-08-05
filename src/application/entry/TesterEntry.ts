import 'reflect-metadata';

import {container, inject, injectable} from 'tsyringe';

import * as natural from 'natural';

import {NaturalModule} from '../middleware/NaturalModule';

import {RegistryTool} from '../toolkit/RegistryTool';

interface IFlowResponse {
    action: string;
    message: string;
    entities?: Array<{
        entity: string;
        value: string;
    }>;
}

@injectable ()
export class TesterEntry {
    private classifier: natural.LogisticRegressionClassifier;
    private wordTokenizer: natural.WordTokenizer;

    constructor (
        @inject (NaturalModule) private languageModule: NaturalModule
    ) {
        this.classifier = new natural.LogisticRegressionClassifier ();
        this.wordTokenizer = new natural.WordTokenizer ();
    }

    public async initialize (): Promise<void> {

        await this.languageModule.initialize ();

    }

    // @ts-ignore
    private async trainBasicModel (): Promise<void> {
        try {
            // Datos de entrenamiento ampliados
            const trainingData = [
                // Compra laptop
                {text: 'comprar laptop', intent: 'compra.laptop'},
                {text: 'quiero un portátil', intent: 'compra.laptop'},
                {text: 'necesito una computadora', intent: 'compra.laptop'},
                {text: 'deseo adquirir notebook', intent: 'compra.laptop'},
                {text: 'cotización de laptops', intent: 'compra.laptop'},

                // Consulta pedido
                {text: 'dónde está mi pedido', intent: 'consulta.pedido'},
                {text: 'estado de mi envío', intent: 'consulta.pedido'},
                {text: 'quiero saber de mi compra', intent: 'consulta.pedido'},
                {text: 'cómo va mi orden', intent: 'consulta.pedido'},
                {text: 'número de seguimiento', intent: 'consulta.pedido'},

                // Recomendación
                {text: 'recomiéndame un laptop', intent: 'consulta.recomendacion'},
                {text: 'qué computadora me sugieres', intent: 'consulta.recomendacion'},
                {text: 'cuál portátil comprar', intent: 'consulta.recomendacion'},
                {text: 'ayuda para elegir laptop', intent: 'consulta.recomendacion'},
                {text: 'mejor laptop para programar', intent: 'consulta.recomendacion'}
            ];

            // Procesar y agregar documentos de entrenamiento
            trainingData.forEach (item => {
                const processedText = this.preprocessText (item.text);
                this.classifier.addDocument (processedText, item.intent);
            });

            // Entrenar el modelo
            await new Promise<void> ((resolve) => {
                this.classifier.train ();
                console.log ('Modelo entrenado con éxito con', trainingData.length, 'ejemplos');
                resolve ();
            });

        } catch (error) {
            console.error ('Error durante el entrenamiento:', error);
            throw error;
        }
    }

    private preprocessText (text: string): string {
        // 1. Normalización básica del texto
        text = text.toLowerCase ()
            .normalize ("NFD").replace (/[\u0300-\u036f]/g, "") // Eliminar acentos
            .replace (/[^\w\sáéíóúüñ]/gi, '') // Mantener caracteres en español
            .replace (/\b(yo|deseo|necesito|me|mi|un|una|por|favor|quiero|comprar)\b/gi, ''); // Palabras vacías

        // 2. Tokenización (sin stemming por ahora)
        const tokens = this.wordTokenizer.tokenize (text) || [];
        return tokens.join ('_');

    }

    public async classifyQuestion (question: string): Promise<IFlowResponse> {
        try {
            const processedText = this.preprocessText (question);
            const classifications = this.classifier.getClassifications (processedText);
            const topResult = classifications[0];

            console.log ('Resultados de clasificación:', classifications);

            // Umbral dinámico
            const threshold = this.calculateDynamicThreshold (classifications);

            if (topResult.value >= threshold) {
                return {
                    action: topResult.label,
                    message: this.generateResponse (topResult.label, question),
                    entities: this.extractEntities (question)
                };
            }

            return this.generateFallbackResponse (question, classifications);

        } catch (error) {
            console.error ('Error al clasificar la pregunta:', error);
            return this.generateFallbackResponse (question);
        }
    }

    private calculateDynamicThreshold (classifications: any[]): number {
        const baseThreshold = 0.15; // Umbral más bajo inicial
        if (classifications.length > 1) {
            const diff = classifications[0].value - classifications[1].value;
            return baseThreshold + (diff * 0.3);
        }
        return baseThreshold;
    }

    private extractEntities (text: string): Array<{ entity: string, value: string }> {
        const entities: Array<{ entity: string, value: string }> = [];
        const normalizedText = this.preprocessText (text);

        // Detectar tipo de producto
        if (/(laptop|portatil|computadora|notebook)/i.test (normalizedText)) {
            entities.push ({entity: 'producto', value: 'laptop'});
        }

        // Detectar marcas
        const brandMatch = normalizedText.match (/(samsung|hp|lenovo|dell|asus|acer)/i);
        if (brandMatch) {
            entities.push ({entity: 'marca', value: brandMatch[0].toLowerCase ()});
        }

        return entities;
    }

    private generateResponse (intent: string, originalText: string): string {
        const responses: Record<string, string> = {
            'compra.laptop': `Entendí que quieres comprar un laptop${originalText.includes ('samsung') ? ' Samsung' : ''}. ¿Qué especificaciones necesitas?`,
            'consulta.pedido': 'Para consultar tu pedido, por favor dime tu número de seguimiento.',
            'consulta.recomendacion': 'Para recomendarte el mejor equipo, dime: ¿para qué lo vas a usar principalmente?',
            'default': 'He procesado tu solicitud. ¿Hay algo más específico que necesites?'
        };

        return responses[intent] || responses['default'];
    }

    private generateFallbackResponse (question: string, classifications?: any[]): IFlowResponse {
        // Opciones basadas en las clasificaciones o por defecto
        let options = ["compra", "consulta", "recomendación"];
        if (classifications && classifications.length > 0) {
            options = classifications.slice (0, 3).map (c => c.label.split ('.')[1]);
        }

        return {
            action: "fallback",
            message: `No estoy seguro de entender "${question}". ¿Podrías especificar si es sobre: ${options.join (', ')}?`
        };
    }

    public async testClassification () {
        const testCases = [
            "Quiero comprar una laptop HP",
            "Dónde está mi pedido número 123",
            "Recomiéndame una buena computadora",
            "Necesito un portátil para programar",
            "Estado de mi última compra"
        ];

        console.log ('\n=== INICIO DE PRUEBAS ===');
        for (const question of testCases) {
            const result = await this.classifyQuestion (question);
            console.log (`\nPregunta: "${question}"`);
            console.log (`Intención: ${result.action}`);
            console.log (`Respuesta: ${result.message}`);
            if (result.entities && result.entities.length > 0) {
                console.log (`Entidades detectadas:`, result.entities);
            }
        }
        console.log ('\n=== FIN DE PRUEBAS ===');
    }
}

async function testerEntry (): Promise<void> {

    await RegistryTool.initialize ().then ();

    const testerEntry = container.resolve (TesterEntry);
    await testerEntry.initialize ();
    await testerEntry.testClassification ();

}

testerEntry ().then ();