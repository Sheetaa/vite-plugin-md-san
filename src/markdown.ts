/**
 * @file markdown compile
 * @author Sheeta(wuhayao@gmail.com)
 */

import fs from 'fs';
import path from 'path';
import {marked} from 'marked';
import {parseCodeLang} from './query';

type ExportType = 'html' | 'component';

interface ComponentSnippets {
    // import xxx from 'yyy';
    import: string;
    // 'xxx': xxx
    component: string;
}

interface TemplateData {
    id: string | number;
    // escaped code
    code: string;
    componentRequest: string;
    caption?: string;
}

interface CompileOptions {
    filepath: string;
    exportType?: ExportType;
    template?: string;
}

const defaultTemplate = path.join(__dirname, './theme/default.template');
let templateContent = fs.readFileSync(defaultTemplate, {encoding: 'utf8'});
let file: string;
let exportType: ExportType;
let index: number;
const components: ComponentSnippets[] = [];
const previewBlocks: Map<string, string> = new Map();

function init(options: CompileOptions) {
    file = options.filepath;
    exportType = options.exportType || 'html';
    templateContent = options.template || templateContent;
    index = 1;
    components.splice(0, components.length);
    previewBlocks.clear();
}

const renderer = {
    code(code: string, infostring: string) {
        const codeEsc = code
            .replace(/</g, '&lt;')
            .replace(/`/g, '&#96;');

        const codeLang = parseCodeLang(infostring);
        if (
            exportType === 'component'
            && codeLang.lang === 'san'
            && codeLang.export === 'preview'
        ) {
            const entryTag = `preview-block-${index}`;
            const entryVar = `PreviewBlock${index}`;
            const mapKeyEntry = `${entryVar}.vpms`;
            const mapKeyComponent = `Component${index}.vpms`;
            // /src/markdown/html.md.PreviewBlock1.vpms
            const entryRequest = `${file}.${mapKeyEntry}`;
            // /src/markdown/html.md.Component1.vpms
            const componentRequest = `${file}.${mapKeyComponent}`;
            components.push({
                import: `import ${entryVar} from '${entryRequest}'`,
                component: `'${entryTag}': ${entryVar}`
            });
            previewBlocks.set(mapKeyEntry, getTemplate({
                id: index,
                code: codeEsc,
                componentRequest,
                caption: codeLang.caption
            }));
            previewBlocks.set(mapKeyComponent, code);
            index++;

            return `<${entryTag}></${entryTag}>`;
        }

        return `<pre><code class="language-san">${codeEsc}</code></pre>`;
    }
};

marked.use({renderer});

export function compile(raw: string, compileOptions: CompileOptions) {
    init(compileOptions);

    const html = marked.parse(raw);
    if (compileOptions.exportType === 'html') {
        return {
            html
        };
    }

    const entryComponent = `import {Component} from 'san';
${components.map(item => item.import).join(';\n')};
export default class ComponentDoc extends Component {
    static template = \`<section class=\"markdown\">${html}</section>\`;
    static components = {
        ${components.map(item => item.component).join(',\n\t\t')}
    };
};
`;

    return {
        entryComponent,
        previewBlocks
    }
}

function getTemplate(data: TemplateData) {
    let template = templateContent;
    let key: keyof TemplateData;
    for (key in data) {
        const value = ('' + data[key]) ?? '';
        // <%=id=%>
        template = template.split(new RegExp(`<%=\\s*${key}\\s*=%>`, 'g')).join(value);
    }
    return template;
}
