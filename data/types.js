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

import {
    get_addresses_of_customer,
    get_customers,
    get_data, 
    get_invoices_of_customer,
    get_payments_of_customer,
    get_recurring_services_of_address,
    get_services_of_address,
    get_services_of_invoice
}
from './database.js';

export const {
    nodeInterface, nodeField
} = nodeDefinitions(
    (globalId) => {
        var {
            type, id
        } = fromGlobalId(globalId);
        return get_data(type, id);
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

export const PaymentType = new GraphQLObjectType({
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

export const ServiceType = new GraphQLObjectType({
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

export const RecurringServiceType = new GraphQLObjectType({
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

const {
    connectionType: RecurringServiceConnection,
    edgeType: RecurringServiceEdge
} = connectionDefinitions({
    name: 'RecurringService',
    nodeType: RecurringServiceType
});

export const InvoiceType = new GraphQLObjectType({
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
                return connectionFromPromisedArray(get_services_of_invoice(invoice.id), args)
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

export const AddressType = new GraphQLObjectType({
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
                return connectionFromPromisedArray(get_services_of_address(address.id), args)
            }
        },
        recurring_services: {
            type: RecurringServiceConnection,
            args: connectionArgs,
            resolve: (address, args) => {
                return connectionFromPromisedArray(get_recurring_services_of_address(address.id), args);
            }
        }
    },
    interfaces: [nodeInterface]
})

export const {
    connectionType: AddressConnection,
    edgeType: AddressEdge
} = connectionDefinitions({
    name: 'Address',
    nodeType: AddressType
});

export const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: {
        id: globalIdField('Customer'),
        name: {
            type: GraphQLString
        },
        addresses: {
            type: AddressConnection,
            args: connectionArgs,
            resolve: (customer, args) => {
                return connectionFromPromisedArray(get_addresses_of_customer(customer.id), args)
            }
        },
        payments: {
            type: PaymentConnection,
            args: connectionArgs,
            resolve: (customer, args) => {
               return connectionFromPromisedArray(get_payments_of_customer(customer.id), args)
            }
        },
        invoices: {
            type: InvoiceConnection,
            args: connectionArgs,
            resolve: (customer, args) => {
                return connectionFromPromisedArray(get_invoices_of_customer(customer.id), args);
            }
        },
        is_active: {
            type: GraphQLBoolean
        }
    },
    interfaces: [nodeInterface]
});

export const {
    connectionType: CustomerConnection,
    edgeType: CustomerEdge
} = connectionDefinitions({
    name: 'Customer',
    nodeType: CustomerType
});

export const ViewerType = new GraphQLObjectType({
    name: 'Viewer',
    fields: {
        id: globalIdField('Viewer'),
        customers: {
            type: CustomerConnection,
            args: connectionArgs,
            resolve: (parent, args) => {
                return connectionFromPromisedArray(get_customers(), args);
            }
        },
    }
});