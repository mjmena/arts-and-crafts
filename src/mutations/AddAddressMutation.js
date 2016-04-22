import Relay from 'react-relay';

export default class AddAddressMutation extends Relay.Mutation {
  
  getMutation() {
    return Relay.QL`mutation{ addAddress }`;
  }
  
  getFatQuery() {
    return Relay.QL`
      fragment on AddAddressPayload @relay(pattern: true) {
        viewer{
          customers{
            edges{
              node{
                addresses  
              }
            }
          }
        }
        addressEdge
      }
    `;
  }
  
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'customers',
      parentID: this.props.customer_id,
      connectionName: 'addresses',
      edgeName: 'AddressEdge',
      rangeBehaviors: {
        '': 'append',
      }
    },{
      type: 'REQUIRED_CHILDREN',
      children: [Relay.QL `
        fragment on AddAddressPayload {
          addressEdge{
            node{
              id
            }
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