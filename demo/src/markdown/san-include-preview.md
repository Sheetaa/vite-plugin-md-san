# export md as san component

```san export=preview caption=first
import {Component} from 'san';

export default class ComponentDemo extends Component {
    static template = `
        <div>
            <button type="button">First Button</button>
        </div>
    `;
}
```

```san export=preview caption=second
import {Component} from 'san';

export default class ComponentDemo extends Component {
    static template = `
        <div>
            <button type="button">Second Button</button>
        </div>
    `;
}
```
