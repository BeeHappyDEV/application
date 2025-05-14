import {injectable} from 'tsyringe';

import fsExtra from 'fs-extra';

import {BuilderTool} from '../toolkit/BuilderTool';
import {JsonObject} from '../object/JsonObject';

@injectable ()
export class EnvironmentHelper {

    public async generateDocumentation (paramsObject: JsonObject): Promise<void> {

        const packageString = './package.json';

        const packageJson = await fsExtra.readJson (packageString);

        paramsObject.set ('txt_package', packageString);
        paramsObject.set ('jsn_package', packageJson);
        paramsObject.set ('txt_output', 'src/documentation/environment/environment_configuration.md');

        await this.updateApplicationVersion (paramsObject);
        await this.createEnvironmentOutput (paramsObject);

    }

    private async updateApplicationVersion (paramsObject: JsonObject): Promise<void> {

        const date = new Date ();

        const dateString = [date.getFullYear (), String (date.getMonth () + 1).padStart (2, '0'), String (date.getDate ()).padStart (2, '0')].join ('.');

        const versionString = paramsObject.get ('txt_version') + '/' + dateString;

        const packageObject = paramsObject.get ('jsn_package');

        packageObject.version = versionString;

        await fsExtra.writeJson (paramsObject.get ('txt_package'), packageObject, {spaces: 2});

    }

    private async createEnvironmentOutput (paramsObject: JsonObject): Promise<void> {

        const packageObject = paramsObject.get ('jsn_package');

        let markdownString = '# Environment Configuration\n';

        markdownString += '\n### Scripts Configuration\n\n'
        markdownString += await BuilderTool.buildTable (['***Script***', '***Description***'], Object.entries (packageObject.scripts));
        markdownString += '\n<br/>\n';

        markdownString += '\n### Runtime Dependencies List\n\n'
        markdownString += await BuilderTool.buildTable (['***Dependency***', '***Version***'], Object.entries (packageObject.dependencies));
        markdownString += '\n<br/>\n';

        markdownString += '\n### Development Dependencies List\n'
        markdownString += await BuilderTool.buildTable (['***Name***', '***Abbreviation***'], Object.entries (packageObject.devDependencies));
        markdownString += '\n';

        fsExtra.writeFileSync (paramsObject.get ('txt_output'), markdownString);

    }

}