import Relay from 'react-relay';

export default class AddCustomerMutation extends Relay.Mutation {
    getMutation() {
        return Relay.QL `mutation { addCustomer }`;
    }

    getVariables() {
        return {
            name: this.props.name
        };
    }

    getConfigs() {
        return [
        {
            type: 'RANGE_ADD',
            parentName: 'viewer',
            parentID: this.props.viewer_id,
            connectionName: 'customers',
            edgeName: 'CustomerEdge',
            rangeBehaviors: {
              '': 'append',
            }
            ,
        },
        {
            type: 'REQUIRED_CHILDREN',
            children: [Relay.QL `
                fragment on AddCustomerPayload {
                    customerEdge{
                        node{
                            id
                        }
                    }
                }
            `],
        }];
    }

    getFatQuery() {
        return Relay.QL `
          fragment on AddCustomerPayload {
            viewer{
                customers
            }
            customerEdge
          }
        `;
    }

}