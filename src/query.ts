export interface MarkdownQuery {

    /**
     * @default 'component'
     */
    export: 'html' | 'component' | 'raw' | string;
};

export interface RequestRes {
    filename: string;
    filepath: string;
    query?: MarkdownQuery;
}

export interface CodeLangRes {
    lang: string;
    export?: 'preview' | string;
    caption?: string;
}

export function parseRequest(id: string): RequestRes {
    const [filepath, rawQuery] = id.split('?', 2);
    const filename = filepath.split('/').pop() || '';
    if (!rawQuery) {
        return {
            filename,
            filepath
        };
    }
    const request = new URLSearchParams(rawQuery);
    const query = {} as MarkdownQuery;
    request.forEach((value, name) => {
        if (name === 'export') {
            query[name] = value;
        }
    });
    return {
        filename,
        filepath,
        query
    };
}

export function parseCodeLang(id: string): CodeLangRes {
    const arr = id.split(' ');
    return arr.reduce((acc, cur, index) => {
        const pairs = cur.split('=');
        if (index === 0) {
            acc.lang = pairs[0];
        }
        else {
            let key: keyof CodeLangRes;
            key = pairs[0] as keyof CodeLangRes;
            if (pairs.length > 1) {
                acc[key] = pairs[1];
            }
        }
        return acc;
    }, {lang: ''} as CodeLangRes);
}
