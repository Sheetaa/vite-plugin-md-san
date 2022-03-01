import {Component} from 'san';
import 'vite-plugin-md-san/dist/theme/default.less';
import $style from './index.module.less';
import rawContent from './markdown/raw.md?export=raw';
import htmlContent from './markdown/html.md?export=html';
import sanContent from './markdown/san.md?export=component';
import sanContentPreview from './markdown/san-include-preview.md?export=component';

class Main extends Component {

    static template = `
        <div>
            <section>
                <h1>export: raw</h1>
                <div class="{{$style.content}}">{{rawContent}}</div>
            </section>
            <section>
                <h1>export: html</h1>
                <div class="{{$style.content}}">{{htmlContent}}</div>
            </section>
            <section>
                <h1>export: san component</h1>
                <p>content below rendered by san component</p>
                <div class="{{$style.content}}">
                    <san-content></san-content>
                </div>
            </section>
            <section>
                <h1>export: san component include preview</h1>
                <p>content below rendered by san component</p>
                <div class="{{$style.content}}">
                    <san-content-include-preview></san-content-include-preview>
                </div>
            </section>
        </div>
    `;

    static components = {
        'san-content': sanContent,
        'san-content-include-preview': sanContentPreview
    };

    initData() {
        return {
            $style,
            rawContent,
            htmlContent
        };
    }
}

const main = new Main();
main.attach(document.querySelector('#app') as Element);
