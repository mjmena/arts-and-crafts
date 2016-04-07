import React from 'react';

import Relay from 'react-relay';
import CustomerListItem from './CustomerListItem'

class CustomerList extends React.Component {
  render() {
    let customers = this.props.viewer.customers.map(customer => {
      return (
        <div key={customer.id}>
            <CustomerListItem customer={customer}/>
        </div>
      )
    });
    
    return (
      <div>
        <h1>Customers</h1>
        {customers}
      </div>
    );
  }
}

export default Relay.createContainer(CustomerList, {
  fragments: {
    viewer: () => Relay.QL `
      fragment on Viewer {
        customers{
          id
          ${CustomerListItem.getFragment('customer')}
        }
      }`
  },
});
