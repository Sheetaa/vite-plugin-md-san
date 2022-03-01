# export md as san component

include 2 steps:
1. transform md to html fragment
2. wrap html to template of san component

### san component code

```san
import {Component} from 'san';

export default SanDemo extends Component {
    static template = `<div></div>`;
    static components = {};
    initData () {
        return {
            foo: 'bar'
        };
    }
}
```
