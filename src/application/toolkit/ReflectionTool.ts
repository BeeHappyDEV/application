import {injectable} from "tsyringe";

@injectable ()
export class ReflectionTool {

    private readonly CLASS_METHOD_REGEX = /\sat\s(\w+\.\w+)/;
    private readonly CLASS_NAME_REGEX = /^[a-z]*[A-Z][a-z]*/;
    private readonly STACK_OFFSET = 2;

    public getMethodName (): string[] {

        const reflectionStrings: string[] = [];
        const stackString = new Error ().stack;

        if (!stackString) {

            return reflectionStrings;

        }

        const stackStrings = stackString.split ("\n");

        if (stackStrings.length > this.STACK_OFFSET) {

            const matchArray = stackStrings[this.STACK_OFFSET].match (this.CLASS_METHOD_REGEX);

            if (matchArray?.[1]) {

                const [classString, methodString] = matchArray[1].split (".");

                reflectionStrings.push (classString, methodString);

                const classMatch = classString.match (this.CLASS_NAME_REGEX);

                if (classMatch?.[0]) {

                    reflectionStrings.push (classMatch[0].toLowerCase ());

                }

            }

        }

        return reflectionStrings;

    }

    public static getMethodName () {
        /*
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
        */
        return null;
    }

}