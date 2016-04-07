import React from 'react';

import Relay from 'react-relay';
import Address from './Address';

class CustomerListItem extends React.Component {
  render() {
    return (
      <div>
        <h2>Customer</h2>
        {this.props.customer.name}
        <Address address={this.props.customer.billing_address} />
      </div>
    );
  }
}

export default Relay.createContainer(CustomerListItem, {
  fragments: {
    customer: () => Relay.QL `
      fragment on Customer {
        name
        billing_address{
            id
            ${Address.getFragment('address')}
        }
      }`
  },
});
