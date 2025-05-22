import {BuilderTool} from "../../tools/BuilderTool";
import {FunctionModel} from "../model/FunctionModel";

export class FunctionBuilder {

    public static process (functionModel: FunctionModel): string {

        let buildString = BuilderTool.buildTitle (functionModel.schemaString + '.' + functionModel.functionString);

        let headerStrings: string[] = [];
        headerStrings.push ('Concept');
        headerStrings.push ('Value');

        let dataStrings: string[][] = [];
        dataStrings.push (['schema', functionModel.schemaString]);
        dataStrings.push (['name', functionModel.functionString]);

        if (functionModel.parameterModels.length > 0) {

            if (functionModel.parameterModels.length === 1) {

                dataStrings.push (['parameter', functionModel.parameterModels[0].name]);

            } else {

                functionModel.parameterModels.forEach ((parameterStructure, offsetNumber) => {

                    dataStrings.push (['parameter ' + (offsetNumber + 1), parameterStructure.name]);

                });

            }

        }

        dataStrings.push (['return', functionModel.returnString]);
        dataStrings.push (['path', functionModel.pathString]);

        buildString += BuilderTool.buildTable (headerStrings, dataStrings);

        headerStrings = [];
        dataStrings = [];

        if (functionModel.tableModels.length > 0) {

            headerStrings.push ('Operation');
            headerStrings.push ('Table');

            functionModel.tableModels.forEach ((tableModel) => {

                dataStrings.push ([tableModel.operation.toLowerCase (), BuilderTool.buildTableLink (tableModel.schemaString, tableModel.tableString)]);

            });

            buildString += BuilderTool.buildSeparator ();
            buildString += BuilderTool.buildTable (headerStrings, dataStrings);

        }

        headerStrings = [];
        dataStrings = [];

        if (functionModel.dependencyModels.length > 0) {

            headerStrings.push ('Reference to');

            functionModel.dependencyModels.forEach ((dependencyModel) => {

                dataStrings.push ([BuilderTool.buildReferenceToLink (dependencyModel.schema, dependencyModel.name)]);

            });

            buildString += BuilderTool.buildSeparator ();
            buildString += BuilderTool.buildTable (headerStrings, dataStrings);

        }

        buildString += BuilderTool.buildSeparator ();
        buildString += BuilderTool.buildSource (functionModel.sourceString);

        return buildString;

    }

}