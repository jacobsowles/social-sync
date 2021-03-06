import PropTypes from 'prop-types';
import React, { ComponentState, PureComponent } from 'react';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';

import { setUserServicesState } from '@actions/service.actions';
import ApiService from '@core/api';
import AuthService from '@core/auth';
import ServiceModuleFactory from '@core/services';
import { AppState, UserService } from '@core/types';
import Routes from './Routes';

interface RoutesContainerOwnProps {
  alert: InjectedAlertProp;
}

interface RoutesContainerDispatchProps {
  getUserServices: (userId: string) => Promise<UserService[]>;
}

interface RoutesContainerStateProps {
  services: UserService[] | null;
  userId?: string;
}

type RoutesContainerProps = RoutesContainerOwnProps &
  RoutesContainerDispatchProps &
  RoutesContainerStateProps;

class RoutesContainer extends PureComponent<RoutesContainerProps> {
  public static contextTypes = {
    router: PropTypes.object
  };

  private authService = new AuthService();

  public componentDidUpdate(previousProps: RoutesContainerProps) {
    if (this.props.userId && (!this.props.services || this.props.services.length === 0)) {
      this.props.getUserServices(this.props.userId);
    }
  }

  public handleAuthentication = (nextState: ComponentState): void => {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
      this.authService.handleAuthentication((location: string) =>
        this.context.router.history.replace(location)
      );
    }
  };

  public render() {
    const serviceModules = this.props.services
      ? this.props.services
          .filter(service => service.isConnected)
          .map(service => ServiceModuleFactory.getServiceModule(service.name, this.props.userId))
      : null;

    return (
      <Routes
        handleAuthentication={this.handleAuthentication}
        serviceModules={serviceModules}
        services={this.props.services}
        userId={this.props.userId}
      />
    );
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<Action>,
  ownProps: RoutesContainerOwnProps
): RoutesContainerDispatchProps => {
  return {
    getUserServices: async (userId: string): Promise<UserService[]> => {
      try {
        const api = new ApiService();
        const response = await api.getUserServices(userId);

        response.data = response.data.sort((a: UserService, b: UserService) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        dispatch(setUserServicesState(response.data));

        return response.data;
      } catch (error) {
        ownProps.alert.error('Unable to load list of services.');
      }
    }
  };
};

const mapStateToProps = (state: AppState) => {
  return {
    services: state.services,
    userId: state.user ? state.user.sub : undefined
  };
};

export default withAlert(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RoutesContainer)
);
