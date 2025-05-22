export class BuilderTool {

    public static buildTitle (titleString: string): string {

        let returnedString = '# ';
        returnedString += titleString;
        returnedString += '\n\n';

        return returnedString;

    }

    public static buildTable (headerStrings: string[], dataStrings: string[][]): string {

        headerStrings = headerStrings.map (itemString => '***' + itemString + '***');

        const widthNumbers = this.calculateColumnWidths (headerStrings, dataStrings);

        let returnedString = this.assignHeaderRow (headerStrings, widthNumbers);
        returnedString += this.assignSeparatorRow (headerStrings, widthNumbers);
        returnedString += this.assignDataRows (dataStrings, widthNumbers);
        returnedString += '\n';

        return returnedString;

    }

    public static buildTableLink (schemaString: string, nameString: string): string {

        let returnedString = '';
        returnedString += '[';
        returnedString += schemaString + '.' + nameString;
        returnedString += '](';
        returnedString += '../../tables/' + schemaString + '/' + nameString;
        returnedString += '.md)';

        return returnedString;

    }

    public static buildReferenceToLink (schemaString: string, nameString: string): string {

        let returnedString = '';
        returnedString += '[';
        returnedString += schemaString + '.' + nameString;
        returnedString += '](';
        returnedString += '../../functions/' + schemaString + '/' + nameString;
        returnedString += '.md)';

        return returnedString;

    }

    public static buildSource (contentString: string): string {

        let returnedString = '```sql\n';
        returnedString += contentString;
        returnedString += '\n```\n';

        return returnedString;

    }

    public static buildSeparator (): string {

        return '<br/>\n\n';

    }

    private static calculateColumnWidths (headerStrings: string[], dataStrings: string[][]): number[] {

        return headerStrings.map ((headerString, offsetNumber) => {

            const lengthNumber = Math.max (...dataStrings.map (rowString => rowString[offsetNumber]?.length || 0));

            return Math.max (headerString.length, lengthNumber);

        });

    }

    private static assignHeaderRow (headerStrings: string[], widthNumbers: number[]): string {

        let rowString = '|';

        for (let offsetNumber = 0; offsetNumber < headerStrings.length; offsetNumber++) {

            rowString += ' ' + headerStrings[offsetNumber].padEnd (widthNumbers[offsetNumber]) + ' |';

        }

        return rowString + '\n';

    }

    private static assignSeparatorRow (headerStrings: string[], widthNumbers: number[]): string {

        let rowString = '|';

        for (let offsetNumber = 0; offsetNumber < headerStrings.length; offsetNumber++) {

            rowString += '-' + '-'.repeat (widthNumbers[offsetNumber]) + '-|';

        }

        return rowString + '\n';

    }

    private static assignDataRows (dataStrings: string[][], widthNumbers: number[]): string {

        let rowString = '';

        for (const dataString of dataStrings) {

            rowString += '|';

            for (let offsetNumber = 0; offsetNumber < dataString.length; offsetNumber++) {

                rowString += ' ' + dataString[offsetNumber].padEnd (widthNumbers[offsetNumber]) + ' |';

            }

            rowString += '\n';

        }

        return rowString;

    }

}