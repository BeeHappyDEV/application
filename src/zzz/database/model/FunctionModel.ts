import {ParameterModel} from "./ParameterModel";
import {TableModel} from "./TableModel";

export interface FunctionModel {
    pathString: string;
    sourceString: string;
    schemaString: string;
    functionString: string;
    returnString: string;
    parameterModels: ParameterModel[];
    tableModels: TableModel[];
    dependencyModels: DependencyModel[];
    isRecursive: boolean;
}