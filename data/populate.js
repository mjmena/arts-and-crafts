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

knex.delete().from('Customer').then(function() {
    return knex.insert({
        name: 'Mr. John Doe',
        is_active: true
    }).into('Customer')
}).then(function(customer_id) {
    return knex.insert({
            customer_id: customer_id,
            start: moment().startOf('month').format(),
            end: moment().endOf('month').format()
        })
        .into('Invoice')
        .then(function(invoice_id) {
            return knex.insert({
                    description: 'Cityville',
                    address: '1234 Street Rd. Cityville, ST 00000',
                    is_billing_address: true,
                    is_active: true,
                    customer_id: customer_id
                })
                .into('Address')
                .then(function(address_id) {
                    return knex.insert({
                            address_id: address_id,
                            invoice_id: invoice_id,
                            description: 'Cut and Trim',
                            cost: 40,
                            start: moment().format(),
                            end: moment().format(),
                        }).into('Service')
                        .then(function() {
                            return knex.insert({
                                address_id: address_id,
                                invoice_id: invoice_id,
                                description: 'Mulch',
                                cost: 1500,
                                start: moment().startOf('week').format(),
                                end: moment().endOf('week').format(),
                            }).into('Service')
                        }).then(function(){
                            return knex.insert([{
                                description: 'Cut and Trim',
                                cost: 35,
                                day: 2,
                                type: 'Weekly',
                                address_id: address_id
                            },{
                                description: 'Trim Hedges',
                                cost: 70,
                                day: 2,
                                week: 'Last',
                                type: 'Monthly',
                                address_id: address_id
                            },{
                                description: 'Mulch',
                                cost: 1400,
                                day: 6,
                                week: 'Second',
                                month: 4,
                                type: 'Yearly',
                                address_id: address_id
                            }]).into('RecurringService')
                        })
                })
        }).then(function() {
            return knex.insert({
                customer_id: customer_id,
                type: 'Cash',
                amount: 400,
                date: moment().add(-1, 'month').endOf('month').format()
            }).into('Payment')
            .then(function() {
                return knex.insert({
                    customer_id: customer_id,
                    type: 'Check',
                    description: '0000000000000000000',
                    amount: 700,
                    date: moment().add(-1, 'month').startOf('month').format()
                }).into('Payment')
            })
        })
}).then(function() {
    return knex.select().from('Customer');
}).map(function(customer) {
    console.log(customer);
}).finally(function() {
  knex.destroy();
})