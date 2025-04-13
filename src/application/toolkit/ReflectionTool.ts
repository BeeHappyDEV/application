export class ReflectionTool {

    public static getMethodName () {

        let reflectionStrings: String[] = [];

        let stackString = new Error ().stack;

        if (stackString) {

            let lineStrings = stackString.split ("\n");

            let offsetInteger = 0;

            for (let lineString of lineStrings) {

                let regExpMatchArray1 = lineString.match (/\sat\s(\w+\.\w+)/);

                if (regExpMatchArray1 && regExpMatchArray1 [1]) {

                    if (offsetInteger === 2) {

                        reflectionStrings.push (regExpMatchArray1 [1].split ('.') [0]);
                        reflectionStrings.push (regExpMatchArray1 [1].split ('.') [1]);

                        let regExpMatchArray2 = regExpMatchArray1 [1].split ('.') [0].match (/^[a-z]*[A-Z][a-z]*/);

                        if (regExpMatchArray2 && regExpMatchArray2 [0]) {

                            reflectionStrings.push (regExpMatchArray2 [0].toLowerCase ());

                        }

                        return reflectionStrings;

                    }

                }

                offsetInteger++;

            }

        }

        return reflectionStrings;

    }

}