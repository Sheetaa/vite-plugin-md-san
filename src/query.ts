export interface Query {
    [index: string]: string
}

export interface RequestRes {
    filename: string;
    filepath: string;
    query?: Query;
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
    const query = {} as Query;
    request.forEach((value, name) => {
        query[name] = value;
    });
    return {
        filename,
        filepath,
        query
    };
}

export function querystring(query: Query) {
    const result = [];
    for (let [key, value] of Object.entries(query)) {
        result.push(`${key}=${value ? value : ''}`);
    }
    return result.join('&');
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
