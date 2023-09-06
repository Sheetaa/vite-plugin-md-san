/**
 * @file transform function
 * @author Sheeta(wuhayao@gmail.com)
 */

import {parseRequest} from './query';
import {compile} from './markdown';
import {TransformOption} from './index';

export function createTransform(options: TransformOption) {

    return function (id: string, raw: string) {
        const {filepath, query} = parseRequest(id);
        const realOptions = Object.assign({
            export: 'component'
        }, options, query);

        const alias = options.config.resolve.alias || [];

        switch (realOptions.export) {
            case 'html':
                const {html} = compile(raw, {
                    filepath,
                    alias,
                    exportType: 'html'
                });
                return {
                    transformed: `export default \`${html}\``
                };
            case 'component':
                let {
                    entryComponent: transformed,
                    previewBlocks: attachment
                } = compile(raw, {
                    filepath,
                    exportType: 'component',
                    alias,
                    template: realOptions.template,
                    query
                });
                return {
                    transformed: transformed || '',
                    attachment
                };
            case 'raw':
            default:
                return {
                    transformed: `export default \`${raw}\``
                };
        }
    };
};
