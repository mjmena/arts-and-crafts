var moment = require('moment');

var knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: process.env.IP,
        user: 'mjmena',
        password: '',
        database: 'artsandcrafts'
    }
});

var data = require('./sample');

knex.delete().from('Customer').then(function () {
    data.forEach(function (customer) {
        knex.insert({
                name: customer.name,
                is_active: customer.is_active
            }).into('Customer')
            .then(function (customer_id) {
                return knex.insert({
                        customer_id: customer_id,
                        start: customer.invoices[0].start,
                        end: customer.invoices[0].end
                    })
                    .into('Invoice')
                    .then(function (invoice_id) {
                        return knex.insert({
                                description: customer.addresses[0].description,
                                address: customer.addresses[0].address,
                                is_billing_address: true,
                                is_active: true,
                                customer_id: customer_id
                            })
                            .into('Address')
                            .then(function (address_id) {
                                return knex.insert({
                                        address_id: address_id,
                                        invoice_id: invoice_id,
                                        description: customer.addresses[0].services[0].description,
                                        cost: customer.addresses[0].services[0].cost,
                                        start: customer.addresses[0].services[0].start,
                                    }).into('Service')
                                    .then(function () {
                                        return knex.insert({
                                            description: 'description', 
                                            cost: customer.addresses[0].recurring_services[0].cost,
                                            day: customer.addresses[0].recurring_services[0].day,
                                            type: customer.addresses[0].recurring_services[0].type,
                                            address_id: address_id
                                        }).into('RecurringService')
                                    })
                            })
                    }).then(function () {
                        return knex.insert({
                                customer_id: customer_id,
                                type: customer.payments[0].type,
                                description: customer.payments[0].description,
                                amount: customer.payments[0].amount,
                                date: customer.payments[0].date
                            }).into('Payment')
                    })
            })

    })
}).then(function () {
    return knex.select().from('Customer');
}).map(function (customer) {
    console.log(customer);
})