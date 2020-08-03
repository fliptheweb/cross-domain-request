### Cross-domain requests without CORS-support 🏓
Do you need to make a request (POST or GET) from browser to external resource **without CORS**?

If you don't have access for the requested resource and not able to setup the correct `CORS policy`, use `jsonp` or make [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) transport – that simple, lightweight (2kb) and zero-dependency library could help you.

You could make an ajax-like cross-domain request, but without **receiving the response**, because of browser's XSS-protection.

Example ([sandbox.io](https://codesandbox.io/s/stoic-pare-2di75?file=/src/index.js)):
```js
import CrossDomainRequest from 'cross-domain-request'

const data = {
  foo: 'bar'
}
CrossDomainRequest('https://reqbin.com/echo/post/form', data)
```

Parameters:
```js
CrossDomainRequest(url, data, options)
```
- `url` (string) - requested url for submit data;
- `data` (Object);
- `options` ([Object]) - options with method, eg GET (`{ method: 'POST' }` by default);

How it works and what's happened under the hood:
- Make a hidden form;
- Make an iframe and connect with the form by [`target`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-target) attribute for prevent reload/open new browser tab;
- Fill the form data and submit to passed url, but with `target` page won't be reloaded and result will be in the iframe;
- Clean all artifacts.

#### TODO:
- [ ] custom function for serialize nested data
- [ ] tests
- [ ] ability to pass FormData

#### References
- [post-robot](https://github.com/krakenjs/post-robot) - Cross-domain post-messaging library
