import {container, injectable} from 'tsyringe';

import fsExtra from 'fs-extra';

import {CommonsTool} from '../toolkit/CommonsTool';
import {ExceptionTool} from '../toolkit/ExceptionTool';
import {LogTool} from '../toolkit/LogTool';
import {JsonObject} from '../object/JsonObject';
import {ResultObject} from '../object/ResultObject';

@injectable ()
export class DocumentService {

    public async getGenerateAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        const packageString = './package.json';

        const packageJson = await fsExtra.readJson (packageString);

        paramsObject.set ('txt_package', packageString);
        paramsObject.set ('jsn_package', packageJson);
        paramsObject.set ('txt_destiny', 'src/documentation/environment/development_lifecycle.md')

        const resultObject = container.resolve (ResultObject);

        try {

            await this.setApplicationVersion (paramsObject, logTool.trace ());
            await this.pushDevelopmentLifecycle (paramsObject, logTool.trace ());

            resultObject.setResult (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async setApplicationVersion (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        let resultObject = container.resolve (ResultObject);

        const date = new Date ();

        const dateString = [date.getFullYear (), String (date.getMonth () + 1).padStart (2, '0'), String (date.getDate ()).padStart (2, '0')].join ('.');

        const versionString = paramsObject.get ('txt_version') + '/' + dateString;

        const packageObject = paramsObject.get ('jsn_package');

        packageObject.version = versionString;

        await fsExtra.writeJson (paramsObject.get ('txt_package'), packageObject, {spaces: 2});

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async pushDevelopmentLifecycle (paramsObject: JsonObject, traceObject: JsonObject): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        const packageObject = paramsObject.get ('jsn_package');

        let markdownContent = '# Development Lifecycle\n\n';

        markdownContent += '### Scripts Configuration\n\n'
        markdownContent += this.prepareTable (Object.entries (packageObject.scripts), ['***Script***', '***Description***']);
        markdownContent += '\n<br/>\n\n';

        markdownContent += '### Runtime Dependencies List\n\n'
        markdownContent += this.prepareTable (Object.entries (packageObject.dependencies), ['***Dependency***', '***Version***']);
        markdownContent += '\n<br/>\n\n';

        markdownContent += '### Development Dependencies List\n\n'
        markdownContent += this.prepareTable (Object.entries (packageObject.devDependencies), ['***Dependency***', '***Version***']);

        await fsExtra.writeFile (paramsObject.get ('txt_destiny'), markdownContent);

        logTool.finalize ();

    }

    private prepareTable (entriesArray: [string, string][], headers: [string, string]): string {

        const width1Number = Math.max(headers[0].length, ...entriesArray.map(([key]) => key.length));
        const width2Number = Math.max(headers[1].length, ...entriesArray.map(([_, value]) => value.length));

        let tableString = '| ' + headers[0].padEnd(width1Number) + ' | ' + headers[1].padEnd(width2Number) + ' |\n';
        tableString += '|-' + '-'.repeat(width1Number) + '-|-' + '-'.repeat(width2Number) + '-|\n';

        entriesArray.forEach(([key, value]) => {
            tableString += '| ' + key.padEnd(width1Number) + ' | ' + value.padEnd(width2Number) + ' |\n';
        });

        return tableString;

    }





}