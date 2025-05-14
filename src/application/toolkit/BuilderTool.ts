export class BuilderTool {

    public static async buildTable (headerStrings: string[], dataStrings: string[][]): Promise<string> {

        const widthNumbers = await this.calculateColumnWidths (headerStrings, dataStrings);

        let tableString = await this.buildHeaderRow (headerStrings, widthNumbers);
        tableString += await this.buildSeparatorRow (headerStrings, widthNumbers);
        tableString += await this.buildDataRows (dataStrings, widthNumbers);

        return tableString;

    }

    public static async calculateColumnWidths (headerStrings: string[], dataStrings: string[][]): Promise<number[]> {

        return headerStrings.map ((headerString, offsetNumber) => {

            const lengthNumber = Math.max (...dataStrings.map (rowString => rowString[offsetNumber]?.length || 0));

            return Math.max (headerString.length, lengthNumber);

        });

    }

    public static async buildHeaderRow (headerStrings: string[], widthNumbers: number[]): Promise<string> {

        let rowString = '|';

        for (let offsetNumber = 0; offsetNumber < headerStrings.length; offsetNumber++) {

            rowString += ' ' + headerStrings[offsetNumber].padEnd (widthNumbers[offsetNumber]) + ' |';

        }

        return rowString + '\n';

    }

    public static async buildSeparatorRow (headerStrings: string[], widthNumbers: number[]): Promise<string> {

        let rowString = '|';

        for (let offsetNumber = 0; offsetNumber < headerStrings.length; offsetNumber++) {

            rowString += '-' + '-'.repeat (widthNumbers[offsetNumber]) + '-|';

        }

        return rowString + '\n';

    }

    public static async buildDataRows (dataStrings: string[][], widthNumbers: number[]): Promise<string> {

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