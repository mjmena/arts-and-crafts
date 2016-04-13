import React from 'react';
import Relay from 'react-relay';

import PaymentProfile from './PaymentProfile';

class PaymentProfileList extends React.Component {
  render() {
    return (
      <div>
        <h2>Payments</h2>
        {this.props.payments.edges.map((edge, index)=>{
            return <PaymentProfile payment={edge.node} key={index}/>    
        })}
      </div>
    );
  }
}

export default Relay.createContainer(PaymentProfileList, {
  fragments: {
    payments: () => Relay.QL `
      fragment on PaymentConnection {
        edges{
            node{
                ${PaymentProfile.getFragment('payment')}
            }
        }
    }`
  },
});
