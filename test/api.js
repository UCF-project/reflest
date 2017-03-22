import test from 'ava';
import Reflest from '../index';

test('Creates an object', t => {
	const Api = Reflest.createGateway({
		request: () => {},
		routes: {}
	});
	t.truthy(Api);
	t.is(typeof Api, 'object');
});

test('Request without origin', async t => {
	function requestFn(url, options) {
		t.is(url, 'testpath');
		t.deepEqual(options, {});
		return Promise.resolve('called');
	}
	const Api = Reflest.createGateway({
		request: requestFn,
		routes: {
			testroute: {
				pathname: 'testpath'
			}
		}
	});
	const result = await Api.testroute();
	t.is(result, 'called');
});

test('Request with origin', async t => {
	function requestFn(url, options) {
		t.is(url, 'http://localhost/testpath');
		t.deepEqual(options, {});
		return Promise.resolve('called');
	}
	const Api = Reflest.createGateway({
		request: requestFn,
		origin: 'http://localhost/',
		routes: {
			testroute: {
				pathname: 'testpath'
			}
		}
	});
	const result = await Api.testroute();
	t.is(result, 'called');
});

