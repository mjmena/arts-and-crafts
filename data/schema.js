import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString
}
from 'graphql';

import {
    connectionArgs,
    connectionDefinitions,
    connectionFromPromisedArray,
    fromGlobalId,
    globalIdField,
    nodeDefinitions
}
from 'graphql-relay';

var knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: process.env.IP,
        user: 'mjmena',
        password: '',
        database: 'artsandcrafts'
    },
    debug: true
});

const {
    nodeInterface, nodeField
} = nodeDefinitions(
    (globalId) => {
        var {
            type, id
        } = fromGlobalId(globalId);
        return knex.select().from(type).where('id', id)
            .then((rows) => {
                let row = rows[0];
                row.model = type;
                return row;
            })
    }, (obj) => {
        if (obj.model == "Customer") {
            return CustomerType;
        }
        else if (obj.model == "Address") {
            return AddressType;
        }
        else if (obj.model == "Invoice") {
            return InvoiceType;
        }
        else if (obj.model == "Service") {
            return ServiceType;
        }
        else if (obj.model == "Payment") {
            return PaymentType;
        }
        else if (obj.model == "RecurringService") {
            return RecurringServiceType;
        }
        else {
            return ViewerType;
        }
    }
);

const PaymentType = new GraphQLObjectType({
    name: 'Payment',
    fields: {
        id: globalIdField('Payment'),
        type: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        amount: {
            type: GraphQLFloat
        },
        date: {
            type: GraphQLString
        }
    },
    interfaces: [nodeInterface]
})

const {
    connectionType: PaymentConnection,
    edgeType: PaymentEdge
} = connectionDefinitions({
    name: 'Payment',
    nodeType: PaymentType
});

let ServiceType = new GraphQLObjectType({
    name: 'Service',
    fields: {
        id: globalIdField('Service'),
        description: {
            type: GraphQLString
        },
        cost: {
            type: GraphQLFloat
        },
        start: {
            type: GraphQLString
        },
        end: {
            type: GraphQLString
        }
    },
    interfaces: [nodeInterface]
})

const {
    connectionType: ServiceConnection,
    edgeType: ServiceEdge
} = connectionDefinitions({
    name: 'Service',
    nodeType: ServiceType
});

let RecurringServiceType = new GraphQLObjectType({
    name: 'RecurringService',
    fields: {
        id: globalIdField('RecurringService'),
        description: {
            type: GraphQLString
        },
        cost: {
            type: GraphQLFloat
        },
        day: {
            type: GraphQLInt
        },
        week: {
            type: GraphQLString
        },
        month: {
            type: GraphQLInt
        },
        type: {
            type: GraphQLString
        }
    },
    interfaces: [nodeInterface]
})

const InvoiceType = new GraphQLObjectType({
    name: 'Invoice',
    fields: {
        id: globalIdField('Invoice'),
        start: {
            type: GraphQLString
        },
        end: {
            type: GraphQLString
        },
        services: {
            type: ServiceConnection,
            args: connectionArgs,
            resolve: (invoice, args) => {
                console.log(args)
                var query = knex.select().from('Service').where('invoice_id', invoice.id);
                return connectionFromPromisedArray(query, args)
            }
        }
    },
    interfaces: [nodeInterface]
})

const {
    connectionType: InvoiceConnection,
    edgeType: InvoiceEdge
} = connectionDefinitions({
    name: 'Invoice',
    nodeType: InvoiceType
});

const AddressType = new GraphQLObjectType({
    name: 'Address',
    fields: {
        id: globalIdField('Address'),
        description: {
            type: GraphQLString
        },
        address: {
            type: GraphQLString,
        },
        is_billing_address: {
            type: GraphQLBoolean
        },
        is_active: {
            type: GraphQLBoolean
        },
        services: {
            type: ServiceConnection,
            args: connectionArgs,
            resolve: (address, args) => {
                var query = knex.select().from('Service').where('address_id', address.id);
                return connectionFromPromisedArray(query, args)
            }
        },
        recurring_services: {
            type: new GraphQLList(RecurringServiceType),
            resolve: (address, args) => {
                var query = knex.select().from('RecurringService').where('address_id', address.id);
                return query;
            }
        }
    },
    interfaces: [nodeInterface]
})

const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: {
        id: globalIdField('Customer'),
        name: {
            type: GraphQLString
        },
        billing_address: {
            type: AddressType,
            resolve: (customer) => {
                let query = knex.select().from('Address').where('Address.customer_id', customer.id).where('Address.is_billing_address', true);
                return query.then((rows) => rows[0]);
            }
        },
        addresses: {
            type: new GraphQLList(AddressType),
            resolve: (customer) => {
                let query = knex.select().from('Address').where('Address.customer_id', customer.id)
                return query;
            }
        },
        payments: {
            type: PaymentConnection,
            args: connectionArgs,
            resolve: (customer, args) => {
                let query = knex.select().from('Payment').where('Payment.customer_id', customer.id);
                return connectionFromPromisedArray(query, args)
            }
        },
        invoices: {
            type: InvoiceConnection,
            args: connectionArgs,
            resolve: (customer, args) => {
                let query = knex.select().from('Invoice').where('Invoice.customer_id', customer.id);
                return connectionFromPromisedArray(query, args);
            }
        },
        is_active: {
            type: GraphQLBoolean
        }
    },
    interfaces: [nodeInterface]
});

const ViewerType = new GraphQLObjectType({
    name: 'Viewer',
    fields: {
        customers: {
            type: new GraphQLList(CustomerType),
            resolve: () => {
                return knex.select().from('Customer').where('is_active', true);
            }
        },
    }
});

let schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            viewer: {
                type: ViewerType,
                resolve: (root) => {
                    return {}
                }
            },
            customers: {
                type: new GraphQLList(CustomerType),
                resolve: (root) => {
                    return knex.select().from('Customer');
                }
            },
            node: nodeField
        }
    })
});

export default schema;