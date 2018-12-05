import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Routes from '@components/Routes';
import { init, shallow } from '@tests/component-test-base';

jest.mock(
  '@core/auth/auth.service',
  () =>
    class MockAuthService {
      public login = jest.fn();
      public isAuthenticated = () => true;
    }
);

describe('Routes', () => {
  init(() => <Routes />);

  it('should always render a container', () => {
    shallow()
      .find('.container')
      .should.have.lengthOf(1);
  });

  it('should always render a Switch component', () => {
    shallow()
      .find(Switch)
      .should.have.lengthOf(1);
  });

  it('should always render a Route component', () => {
    shallow()
      .find(Route)
      .should.have.length.greaterThan(0);
  });
});
