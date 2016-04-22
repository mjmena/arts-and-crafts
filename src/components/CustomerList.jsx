import React from 'react';

import Relay from 'react-relay';
import CustomerListItem from './CustomerListItem'

class CustomerList extends React.Component {
  render() {
    let customers = this.props.viewer.customers.edges.map((edge, index) => {
      const customer = edge.node; 
      return (
        <div key={index}>
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
        id
        customers(first: 50){
          edges{ 
            node{
              ${CustomerListItem.getFragment('customer')}
            }
          }
        }
      }`
  },
});
