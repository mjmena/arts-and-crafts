import React from 'react';
import Relay from 'react-relay';

import AddressProfileList from './AddressProfileList';
import PaymentProfileList from './PaymentProfileList'

class CustomerProfile extends React.Component {
  render() {
    let customer = this.props.customer;
    return (
      <div>
        <h2>{customer.name}</h2>
        <AddressProfileList addresses={customer.addresses} />
        <PaymentProfileList payments={customer.payments} />
      </div>
    );
  }
}

export default Relay.createContainer(CustomerProfile, {
  fragments: {
    customer: () => Relay.QL `
      fragment on Customer {
        name
        addresses(first:10){
          ${AddressProfileList.getFragment('addresses')}
        }
        payments(first:10){
          ${PaymentProfileList.getFragment('payments')} 
        }
      }`
  },
});
