import React from 'react';

import Relay from 'react-relay';
import {Link} from 'react-router';

class CustomerListItem extends React.Component {
  render() {
    const customer = this.props.customer;
    return (
      <div>
        <Link to={`/customer/${customer.id}`}>
          {customer.name}
        </Link>
      </div>
    );
  }
}

export default Relay.createContainer(CustomerListItem, {
  fragments: {
    customer: () => Relay.QL `
      fragment on Customer {
        id
        name
      }`
  },
});
