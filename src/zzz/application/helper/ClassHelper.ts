import {injectable} from 'tsyringe';

import {FileModel} from '../../common/model/FileModel';
import {ClassModel} from "../model/ClassModel";

@injectable ()
export class ClassHelper {

    // @ts-ignore
    public async process (fileStructure: FileModel): Promise<ClassModel | null> {

        return null;
    }

}