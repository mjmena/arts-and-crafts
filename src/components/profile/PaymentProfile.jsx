import React from 'react';
import Relay from 'react-relay';
import moment from 'moment';

class PaymentProfile extends React.Component {
  render() {
    const payment = this.props.payment;
    return (
      <div>
        <div>
            Type: {payment.type}
        </div>
        <div>
            Description: {payment.description}
        </div>
        <div>
            Amount: {payment.amount}
        </div>
        <div>
            Date: {moment(payment.date).format()}
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(PaymentProfile, {
  fragments: {
    payment: () => Relay.QL `
      fragment on Payment {
        description
        amount
        date
        type
      }`
  },
});
