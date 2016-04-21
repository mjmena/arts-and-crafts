import {
    GraphQLObjectType,
    GraphQLSchema,
}
from 'graphql';

import {ViewerType, nodeField} from './types.js';
import mutations from './mutations';

export default new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            viewer: {
                type: ViewerType,
                resolve: (root) => {
                    return {id:0}
                }
            },
            node: nodeField
        }
    }),
    mutation: mutations
});