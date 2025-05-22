import {BuilderTool} from "../../tools/BuilderTool";
import {TableModel} from "../model/TableModel";

export class TableBuilder {

    public static process (tableModel: TableModel): string {

        let buildString = BuilderTool.buildTitle (tableModel.schemaString + '.' + tableModel.tableString);

        let headerStrings: string[] = [];
        headerStrings.push ('Concept');
        headerStrings.push ('Value');

        let dataStrings: string[][] = [];
        dataStrings.push (['schema', tableModel.schemaString]);
        dataStrings.push (['name', tableModel.tableString]);
        dataStrings.push (['path', tableModel.pathString]);

        buildString += BuilderTool.buildTable (headerStrings, dataStrings);

        headerStrings = [];
        dataStrings = [];

        if (tableModel.constraints.length > 0) {

            headerStrings.push ('Type');
            headerStrings.push ('Name');
            headerStrings.push ('Reference');

            tableModel.constraints.forEach ((constraintModel) => {

                dataStrings.push ([constraintModel.type, constraintModel.name, BuilderTool.buildTableLink (constraintModel.constraintSchema, constraintModel.constraintTable)]);

            });

            buildString += BuilderTool.buildSeparator ();
            buildString += BuilderTool.buildTable (headerStrings, dataStrings);


        }


        dataStrings.push (['name', tableModel.tableString]);
        dataStrings.push (['path', tableModel.pathString]);

        //buildString += BuilderTool.buildSeparator ();
        //buildString += BuilderTool.buildSource (tableModel.content);

        return buildString;

    }

}