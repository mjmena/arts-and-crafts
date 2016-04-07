import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import {RelayRouter} from 'react-router-relay';
import {Route, browserHistory} from 'react-router';

import CustomerList from './components/CustomerList'


class App extends React.Component {
  render() {
    console.log(this.props.viewer)
    return (
      <CustomerList viewer={this.props.viewer}/>
    )
  }
}

const AppContainer = Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL `
      fragment on Viewer{
        ${CustomerList.getFragment('viewer')}
      }
    `
  },
});

ReactDOM.render((
      <RelayRouter history={browserHistory}>
        <Route path="/" component={AppContainer} queries={{ viewer: () => Relay.QL`query { viewer }` }} />
      </RelayRouter>
    ), document.getElementById('root'));