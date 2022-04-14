# vite-plugin-md-san

Import markdown as a ES Module which content could be:
- raw
- HTML
- San Component(including markdown code block preview rendered by San)

## Install

```shell
npm install vite-plugin-md-san
```

```typescript
import {defineConfig} from 'vite'
import mdSan from 'vite-plugin-md-san'

const template = fs.readFileSync(
    path.resolve(__dirname, 'xxx/preview.template'),
    {encoding: 'utf-8'}
);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        mdSan({
            export: 'component', // 'html' | 'component' | 'raw'
            template
        })
    ]
});
```

## Inspired By
- [vite-plugin-md](https://github.com/antfu/vite-plugin-md)
- [vite-plugin-vuedoc](https://github.com/JasKang/vite-plugin-vuedoc)
