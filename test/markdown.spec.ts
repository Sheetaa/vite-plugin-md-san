/**
 * @file transform
 * @author Sheeta(wuhayao@gmail.com)
 */

import fs from 'fs';
import path from 'path';
import {compile} from '../src/markdown';

describe('transform', () => {

    test('html', () => {
        const md = `# title
123
456

\`\`\`san
import {Component} from 'san';

export default SanDemo extends Component {
    static template = \`<div></div>\`;
    static components = {};
    initData () {
        return {
            foo: 'bar'
        };
    }
}
\`\`\`
`;
        const {html} = compile(md, {
            filepath: '/home/work/project/foo.md',
            exportType: 'html'
        });
        expect(html).toMatchSnapshot();
    });

    test('component', () => {
        const relativePath = '../demo/src/markdown/san-include-preview.md';
        let filepath = path.resolve(__dirname, relativePath);
        const md = fs.readFileSync(filepath, {encoding: 'utf-8'});
        filepath = path.join('/home/work/project', relativePath);

        const {
            entryComponent,
            previewBlocks
        } = compile(md, {
            filepath,
            exportType: 'component'
        });
        expect(entryComponent).toMatchSnapshot();

        const keys = Array.from(previewBlocks || []).map(item => item[0]);
        expect(keys).toStrictEqual([
            'PreviewBlock1.vpms',
            'Component1.vpms',
            'PreviewBlock2.vpms',
            'Component2.vpms',
            'PreviewBlock3.vpms',
            'Component3.vpms'
        ]);
        expect(previewBlocks?.get('PreviewBlock1.vpms')).toMatchSnapshot();
        expect(previewBlocks?.get('Component1.vpms')).toMatchSnapshot();
    });

    test('component: custom preview template', () => {
        const relativePath = '../demo/src/markdown/san-include-preview.md';
        let filepath = path.resolve(__dirname, relativePath);
        const md = fs.readFileSync(filepath, {encoding: 'utf-8'});
        filepath = path.join('/home/work/project', relativePath);

        const customTemplatePath = path.resolve(__dirname, 'fixtures/example.template');
        const customTemplate = fs.readFileSync(customTemplatePath, {encoding: 'utf-8'});

        const {previewBlocks} = compile(md, {
            filepath,
            exportType: 'component',
            template: customTemplate
        });
        expect(previewBlocks?.get('PreviewBlock1.vpms')).toMatchSnapshot();
        expect(previewBlocks?.get('PreviewBlock2.vpms')).toMatchSnapshot();
    });

    test('component: custom preview template function', () => {
        const relativePath = '../demo/src/markdown/san-include-preview.md';
        let filepath = path.resolve(__dirname, relativePath);
        const md = fs.readFileSync(filepath, {encoding: 'utf-8'});
        filepath = path.join('/home/work/project', relativePath);

        const customTemplatePath = path.resolve(__dirname, 'fixtures/example.template');
        const customTemplate = fs.readFileSync(customTemplatePath, {encoding: 'utf-8'});

        const {previewBlocks} = compile(md, {
            filepath,
            exportType: 'component',
            template: function (data: any) {
                expect(data.filepath).toBe(filepath);
                return customTemplate;
            }
        });
        expect(previewBlocks?.get('PreviewBlock1.vpms')).toMatchSnapshot();
        expect(previewBlocks?.get('PreviewBlock2.vpms')).toMatchSnapshot();
    });

    test('component: custom preview template with more source', () => {
        const relativePath = '../demo/src/markdown/san-include-preview.md';
        let filepath = path.resolve(__dirname, relativePath);
        const md = fs.readFileSync(filepath, {encoding: 'utf-8'});
        filepath = path.join('/home/work/project', relativePath);

        const customTemplatePath = path.resolve(__dirname, 'fixtures/multi-file.template');
        const customTemplate = fs.readFileSync(customTemplatePath, {encoding: 'utf-8'});

        const {previewBlocks} = compile(md, {
            filepath,
            exportType: 'component',
            alias: [],
            template: customTemplate
        });
        expect(previewBlocks?.get('PreviewBlock1.vpms')).toMatchSnapshot();
        expect(previewBlocks?.get('PreviewBlock2.vpms')).toMatchSnapshot();
        expect(previewBlocks?.get('PreviewBlock3.vpms')).toMatchSnapshot();
    });
});
