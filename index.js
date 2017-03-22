'use strict';

const str = require('string');
const debug = require('debug')('Reflest');

class Gateway {
	constructor(options) {
		debug('constructor');
		this.registeredRoutes = {};
		if (options.request) {
			this.registerRequest(options.request);
		}

		if (options.origin) {
			this.registerOrigin(options.origin);
		} else {
			this.registerOrigin('');
		}

		if (options.routes) {
			this.registerRoute(options.routes);
		}

		this.templateOpen = options.templateOpen || '{';
		this.templateClose = options.templateClose || '}';

		if (options.afterEachRequest) {
			this.afterEachRequest = options.afterEachRequest;
		}
		// TODO: beforeEachRequest, afterRequest, beforeRequest
	}

	registerRoute(route) {
		debug('registerRoute');
		if (typeof route !== 'object') {
			throw new Error('Invalid route type. It must be an object');
		}
		const routeKeys = Object.keys(route);
		routeKeys.forEach(rk => {
			if ({}.hasOwnProperty.call(this, rk) && this.registeredRoutes[rk] !== true) {
				throw new Error(`"${rk} is a invalid route name`);
			}
			this.registeredRoutes[rk] = true;
			this[rk] = this.doRequest.bind(this, route[rk]);
		});
	}

	registerRequest(request) {
		debug('registerRequest');
		this.requests = {
			default: request
		};
	}

	registerOrigin(origin) {
		debug('registerOrigin');
		this.origin = origin;
	}

	createURL(pathname, params) {
		debug('createURL');
		const pathnameWithParams = str(pathname).template(params, this.templateOpen, this.templateClose).s;
		return `${this.origin}${pathnameWithParams}`;
	}

	doRequest(routeOptions, extraRequestOptions, params) {
		debug('doRequest');
		const requestURL = this.createURL(routeOptions.pathname, params || {});
		let requestOptions = {};
		if (routeOptions.options) {
			requestOptions = Object.assign(requestOptions, routeOptions.options);
		}
		if (extraRequestOptions) {
			requestOptions = Object.assign(requestOptions, extraRequestOptions);
		}
		const result = this.requests.default(requestURL, requestOptions);
		if (this.afterEachRequest) {
			return result.then(this.afterEachRequest);
		}
		return result;
	}
}

const Reflest = {
	createGateway(options) {
		return new Gateway(options);
	}
};

module.exports = Reflest;
