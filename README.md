
Library to wrap requests calls in your application.

## API

Reflest expose only one method which creates an object that can be
used later in your application.

`var apiObject = Reflest.createGateway(options);`

Inside the object created by `Reflest.createGateway` you will have
methods corresponding the routes you informed in options. These
methods will then call the request function.

`options.request = fetch`

request is the function to be called in the request.

`options.origin = ''`

origin defines the origin you want to pre-attach to all your
route pathnames.

`options.routes = {routeName: routeOptions}`

routes defines the routes of your API. Each routeName will be a method
within the resulting object.

`routeOptions.pathname`

Contains the pathname template to make the URL requested.

`routeOptions.options`

Options that will be passed to all routeName requests. It is typically
the place to define the request method.

`options.afterEachRequest = data => {}`

afterEachRequest will be called after each request in case
of success (.then).

`options.templateOpen = '{'` and `options.templateClose = '}'`

Template boundaries for applying to the pathname.

`var requestPromise = apiObject.routeName(extraOptions, valuesForTemplateInterpolation)`

When calling a routeName you can pass an object `extraOptions` which
will be merged to `routeOptions.options`, and an object `valuesForTemplateInterpolation` that will be passed to the
[template
engine to interpolate the values](https://www.npmjs.com/package/string#--templatevalues-open-close)
for `routeOptions.pathname`.

## Examples

### Stand-alone

```js
import Reflest from 'reflest';
import fetch from 'isomorphic-fetch';

const RestApi = Refest.createGateway({
    // Use any fetch implementation/library
    request: fetch,
    routes: {
        // testroute will be available as a method in RestApi object
        testroute: {
            pathname: 'testpath'
        }
    }
});

// Here we can call the routes we defined previously
RestApi.testroute().then(data => {
    console.log('request testpath data:', data);
}).catch(err => {
    console.error(err);
})

```

### reflux + reflux-promise + reflest

```js
// File restapi.js
import Reflest from 'reflest';
import fetch from 'isomorphic-fetch';

const RestApi = Reflest.createGateway({
    request: fetch, // Use any fetch implementation/library
    routes: {
        testroute: {
            pathname: 'testpath'
        }
    }
});

export default RestApi;
```

```js
// File load-actions.js
import Reflux from 'reflux';
import RefluxPromise from 'reflux-promise';
import RestApi from './restapi';

// this creates async `load` in LoadActions
var LoadActions = Reflux.createActions({
    "load": {children: ["completed","failed"]}
});

// Here we use our API with Reflest
LoadActions.load.listenAndPromise(RestApi.testroute);

export default LoadActions;
```

### redux + redux-promise + redux-actions + reflest

As seen in https://github.com/acdlite/redux-promise#example-integrating-with-a-web-api-module
Reflest help us to create what they call `Web API`.

```js
// File restapi.js
import Reflest from 'reflest';
import fetch from 'isomorphic-fetch';

const RestApi = Reflest.createGateway({
    request: fetch, // Use any fetch implementation/library
    routes: {
        testroute: {
            pathname: 'testpath'
        }
    }
});

export default RestApi;
```

```js
// File actions.js
import { createActions } from 'redux-actions';
import RestApi from './restapi';

// Here we use our API with Reflest
export const deleteThing = createAction('DELETE_THING', RestApi.testroute);
```
