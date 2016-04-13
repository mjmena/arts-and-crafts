import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import {RelayRouter} from 'react-router-relay';
import {IndexRoute, Route, Link, browserHistory} from 'react-router';

import AddCustomer from './components/AddCustomer';
import CustomerList from './components/CustomerList';
import CustomerProfile from  './components/profile/CustomerProfile';

const style = {
  marginLeft: 10
}

class App extends React.Component {
  render() {
    return (
      <div style={style}>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/customer'>Add Customer</Link></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
}


ReactDOM.render((
      <RelayRouter history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={CustomerList} queries={{ viewer: () => Relay.QL`query { viewer }` }} />
          <Route path='customer/:id' component={CustomerProfile} queries={{ customer: () => Relay.QL`query{ node(id: $id)}` }} />
          <Route path='customer' component={AddCustomer} />
        </Route>
      </RelayRouter>
    ), document.getElementById('root'));