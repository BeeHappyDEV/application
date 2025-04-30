import fsExtra from 'fs-extra';

export class CommonsTool {

    public static async getApplicationVersion (): Promise<string> {

        const packageJson = JSON.parse (fsExtra.readFileSync ('package.json', 'utf-8'));

        return packageJson.version;

    }

    public static async getStackStrings (): Promise<string[]> {

        const reflectionStrings: string[] = [];
        const stackString = new Error ().stack;

        if (!stackString) {

            return reflectionStrings;

        }

        const stackStrings = stackString.split ('\n');

        const stackNumber = 2

        if (stackStrings.length > stackNumber) {

            const matchArray = stackStrings[stackNumber].match (/\sat\s(\w+\.\w+)/);

            if (matchArray?.[1]) {

                const [classString, methodString] = matchArray[1].split ('.');

                reflectionStrings.push (classString, methodString);

                const classMatch = classString.match (/^[a-z]*[A-Z][a-z]*/);

                if (classMatch?.[0]) {

                    reflectionStrings.push (classMatch[0].toLowerCase ());

                }

            }

        }

        return reflectionStrings;

    }

}