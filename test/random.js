'use strict';

const Path = require('path');
const { expect } = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const StandIn = require('stand-in');
const CloudApiGql = require('../lib/');
const CloudApi = require('webconsole-cloudapi-client');
const Graphi = require('graphi');


const lab = exports.lab = Lab.script();
const { describe, it, afterEach } = lab;


describe('random', () => {
  afterEach(() => {
    StandIn.restoreAll();
  });

  const register = [
    {
      plugin: Graphi
    },
    {
      plugin: CloudApiGql,
      options: {
        keyPath: Path.join(__dirname, 'test.key'),
        keyId: 'test',
        apiBaseUrl: 'http://localhost'
      }
    }
  ];

  it('can query for a random machine name', async () => {
    const server = new Hapi.Server();
    StandIn.replaceOnce(CloudApi.prototype, 'fetch', (stand) => {
      return [];
    });

    await server.register(register);
    await server.initialize();
    const res = await server.inject({
      url: '/graphql',
      method: 'post',
      payload: { query: 'query { rndName }' }
    });
    expect(res.statusCode).to.equal(200);
    expect(res.result.data.rndName).to.exist();
  });

  it('can query for a random image', async () => {
    const server = new Hapi.Server();
    StandIn.replaceOnce(CloudApi.prototype, 'fetch', (stand) => {
      return [];
    });

    await server.register(register);
    await server.initialize();
    const res = await server.inject({
      url: '/graphql',
      method: 'post',
      payload: { query: 'query { rndImageName }' }
    });
    expect(res.statusCode).to.equal(200);
    expect(res.result.data.rndImageName).to.exist();
  });
});
