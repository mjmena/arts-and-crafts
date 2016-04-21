import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull
}
from 'graphql';
import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay';
import {ViewerType, CustomerType, AddressType} from './types'

import {
    add_customer,
    add_address
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
            return {};
        }
    },
    customer: {
      type: CustomerType,
      resolve: (payload) => {
        return payload
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
    address: {
      type: AddressType,
      resolve: (payload) => {
        return payload
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