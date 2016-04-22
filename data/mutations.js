import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull
}
from 'graphql';

import {
  offsetToCursor,
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay';
import {ViewerType, CustomerEdge, AddressEdge} from './types'

import {
    add_customer,
    add_address,
    get_addresses_of_customer,
    get_customers
} from './database'

const AddCustomerMutation = mutationWithClientMutationId({
  name: 'AddCustomer',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    viewer: {
        type: ViewerType,
        resolve: (payload) => {
            return {id:0};
        }
    },
    customerEdge: {
      type: CustomerEdge,
      resolve: (payload) => {
        let offset = 0; 
        console.log(payload.id);
        get_customers().then((customers)=> {
            customers.find((customer, index)=>{
              if(customer.id === payload.id){
                offset = index; 
                return true;
              }else{
                return false;
              }
            })
        })
        return {
          cursor: offsetToCursor(offset),
          node: payload,
        };
      }
    }
  },
  mutateAndGetPayload: ({name}) => {
    return add_customer(name);
  }
});

const AddAddressMutation = mutationWithClientMutationId({
  name: 'AddAddress',
  inputFields: {
    customer_id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    description: {
      type: new GraphQLNonNull(GraphQLString)
    },
    location: {
      type: new GraphQLNonNull(GraphQLString)
    },
    is_billing_address: {
      type: new GraphQLNonNull(GraphQLBoolean)
    }
  },
  outputFields: {
    viewer: {
        type: ViewerType,
        resolve: (payload) => {
            return {id:0};
        }
    },
    addressEdge: {
      type: AddressEdge,
      resolve: (payload) => {
        let offset = 0; 
        console.log(payload.id);
        get_addresses_of_customer(payload.customer_id).then((addresses)=> {
            addresses.find((address, index)=>{
              if(address.id === payload.id){
                offset = index; 
                return true;
              }else{
                return false;
              }
            })
        })
        return {
          cursor: offsetToCursor(offset),
          node: payload,
        };
      }
    }
  },
  mutateAndGetPayload: ({customer_id, description, location, is_billing_address}) => {
    var {type, id} = fromGlobalId(customer_id);
    return add_address(id, description, location, is_billing_address);
  }
});

export default new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCustomer: AddCustomerMutation,
        addAddress: AddAddressMutation
    }
});