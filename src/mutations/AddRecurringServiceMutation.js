import Relay from 'react-relay';

export default class AddRecurringServiceMutation extends Relay.Mutation {
  
  getMutation() {
    return Relay.QL`mutation{ addRecurringService }`;
  }
  
  getFatQuery() {
    return Relay.QL`
      fragment on AddRecurringServicePayload {
        
      }
    `;
  }
  
  getConfigs() {
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [Relay.QL `
        fragment on AddAddressPayload {
          address{
            id
          }
        }
      `]
    }];
  }
  
  getVariables() {
    return {
      customer_id: this.props.customer_id,
      description: this.props.description,
      location: this.props.location,
      is_billing_address: this.props.is_billing_address
    };
  }
}