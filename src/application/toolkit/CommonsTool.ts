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

    public static async toBlank (candidateNumber: number): Promise<string> {

        if (candidateNumber != 0) {

            return candidateNumber.toString ();

        } else {

            return '';

        }

    }

    public static toCamelCase (candidateString: string): string {

        if (!candidateString) {

            return '';

        }

        if (candidateString === candidateString.toUpperCase ()) {

            return candidateString.toLowerCase ();

        }

        return candidateString
            .replace (/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase () : '')
            .replace (/^(.)/, (_, c) => c.toLowerCase ());

    }

    public static toPascalCase (candidateString: string): string {

        if (!candidateString) {

            return '';

        }

        if (candidateString === candidateString.toUpperCase ()) {

            return candidateString.charAt (0) + candidateString.slice (1).toLowerCase ();

        }

        return candidateString
            .replace (/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase () : '')
            .replace (/^(.)/, (_, c) => c.toUpperCase ());

    }

}