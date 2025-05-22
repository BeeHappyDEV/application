import fs from 'fs';
import path from 'path';
import {injectable} from "tsyringe";
import {FileModel} from "../model/FileModel";

@injectable ()
export class FileHelper {

    public async getFiles (pathString: string, excludedStrings: string[]): Promise<FileModel[]> {

        let fileStrings = await this.readDirRecursive (pathString);

        fileStrings = fileStrings.filter (file =>

            (file.endsWith ('.sql') || file.endsWith ('.ts')) &&

            !this.isExcluded (file, excludedStrings)
        );

        return Promise.all (fileStrings.map (async fileString => ({
            pathString: fileString,
            fileString: path.basename (fileString),
            sourceString: await fs.promises.readFile (fileString, 'utf-8')
        })));

    }

    private isExcluded (filePath: string, excludedFiles: string[]): boolean {

        const resolvedPath = path.resolve (filePath);

        return excludedFiles.some (excluded => {

            const excludedPath = path.resolve (excluded);

            if (excluded.includes ('*')) {

                const regex = new RegExp (excluded.replace (/\*/g, '.*').replace (/\//g, '\\/'));

                return regex.test (resolvedPath);

            }

            return resolvedPath === excludedPath;

        });

    }

    public async readDirRecursive (pathString: string): Promise<string[]> {

        const entries = await fs.promises.readdir (pathString, {withFileTypes: true});

        const files = await Promise.all (entries.map (entry => {

            const fullPath = path.join (pathString, entry.name);

            return entry.isDirectory () ? this.readDirRecursive (fullPath) : fullPath;

        }));

        return files.flat ();

    }

    public async writeFile (outputPath: string, content: string): Promise<void> {
        const dir = path.dirname (outputPath);
        if (!fs.existsSync (dir)) {
            fs.mkdirSync (dir, {recursive: true});
        }
        return fs.promises.writeFile (outputPath, content);
    }

}