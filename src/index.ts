/**
 * @file vite plugin markdown san
 * @author Sheeta(wuhayao@gmail.com)
 */

import path from 'path';
import {Plugin, ResolvedConfig, ModuleNode} from 'vite';
import {createFilter} from '@rollup/pluginutils';
import {createTransform} from './transform';
import {parseRequest} from './query';

const debug = require('debug')('vite-plugin-md-san:index');

interface PluginOptions {
    export?: 'html' | 'component' | 'raw' | string;
    template?: string | Function;
    // todo
    highlight?: Record<string, unknown>;
}

export type TransformOption = PluginOptions & {config: ResolvedConfig};

type Transform = (id: string, raw: string) => {
    transformed: string;
    attachment?: Map<string, string>;
};

let cachedPreviewBlocks: Map<string, Map<string, string>> = new Map();

export default function VitePluginMarkdownSan(options: PluginOptions): Plugin {

    const filter = createFilter(/\.md\??/);
    const previewFilter = createFilter(/\.vpms$/);
    let transform: Transform;

    let config: ResolvedConfig;

    return {
        name: 'vite-plugin-md-san',
        enforce: 'pre',
        configResolved(resolvedConfig) {
            config = resolvedConfig
            transform = createTransform({config: resolvedConfig, ...options})
        },
        // first: resolve
        resolveId(source) {
            if (previewFilter(source)) {
                const id = source.startsWith(config.root)
                    ? source : path.join(config.root, source);
                return id;
            }
        },
        // second: transform
        transform(raw, id) {
            // filter file ending with .md
            // example: /xxx/site/components/Tag/example.md
            if (!filter(id) || previewFilter(id)) {
                return;
            }

            const {
                transformed,
                attachment
            } = transform(id, raw);
            if (attachment && attachment.size) {
                cachedPreviewBlocks.set(id, attachment);
            }
            return transformed;
        },
        // third: load
        load(id) {
            // example: /xxx/site/components/Tag/example.md.PreviewBlock1.vpms
            if (previewFilter(id)) {
                const idArray = id.split('/');
                const filename = idArray.pop();
                const matched = filename?.match(/([\w-]+\.md)\.([\w-]+\.vpms)/);
                if (matched?.length === 3) {
                    const mdFilename = matched[1];
                    idArray.push(mdFilename);
                    const originId = idArray.join('/');
                    const previewBlockName = matched[2];
                    return cachedPreviewBlocks.get(originId)?.get(previewBlockName);
                }
            }
        },
        async handleHotUpdate(ctx) {
            const {
                file,
                read
            } = ctx;

            if (!filter(file)) {
                return;
            }

            debug('handleHotUpdate:file', file);

            const {filename} = parseRequest(file);
            const defaultRead = read;
            ctx.read = async function() {
                const {
                    transformed,
                    attachment
                } = transform(file, await defaultRead());
                if (attachment && attachment.size) {
                    cachedPreviewBlocks.set(filename, attachment);
                }
                return transformed;
            };
        },
        buildEnd() {
            // todo
        },
        closeBundle() {
            // todo
        }
    };
}
