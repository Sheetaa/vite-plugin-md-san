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

export interface PluginOptions {
    export?: 'html' | 'component' | 'raw' | string;
    // todo
    template?: string;
    // todo
    highlight?: Record<string, unknown>;
}

let cachedPreviewBlocks: Map<string, Map<string, string>> = new Map();

export default function VitePluginMarkdownSan(options: PluginOptions): Plugin {

    const filter = createFilter(/\.md\??/);
    const previewFilter = createFilter(/\.vpms$/);
    const transform = createTransform(options);

    let config: ResolvedConfig;

    return {
        name: 'vite-plugin-md-san',
        enforce: 'pre',
        configResolved(resolvedConfig) {
            config = resolvedConfig
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
            if (!filter(id) || previewFilter(id)) {
                return;
            }

            const {filename} = parseRequest(id);

            const {
                transformed,
                attachment
            } = transform(id, raw);
            if (attachment && attachment.size) {
                cachedPreviewBlocks.set(filename, attachment);
            }
            return transformed;
        },
        // third: load
        load(id) {
            if (previewFilter(id)) {
                const filename = id.split('/').pop();
                const matched = filename?.match(/([\w-]+\.md)\.([\w-]+\.vpms)/);
                if (matched?.length === 3) {
                    const mdFilename = matched[1];
                    const previewBlockName = matched[2];
                    return cachedPreviewBlocks.get(mdFilename)?.get(previewBlockName);
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
