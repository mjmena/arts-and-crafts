import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull
}
from 'graphql';
import {mutationWithClientMutationId} from 'graphql-relay';
import {ViewerType, CustomerType} from './types'

import {
    add_customer
} from './database'

const addCustomerMutation = mutationWithClientMutationId({
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
        console.log(payload)
        return payload
      }
    }
  },
  mutateAndGetPayload: ({name}) => {
    return add_customer(name);
  }
});


export default new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCustomer: addCustomerMutation
    }
});