import 'reflect-metadata';
import { container, injectable } from 'tsyringe';

@injectable()
export class Tester {
    constructor(
    ) {}

    public async testGroqAPI(): Promise<void> {
        console.log('Respuesta directa:');
    }
}

// Uso
(async () => {
    const tester = container.resolve(Tester);
    await tester.testGroqAPI();
})();