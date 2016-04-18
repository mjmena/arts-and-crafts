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

export const add_customer = (name) => {
    return knex.insert({
        name: name,
        is_active: true
    }).into('Customer')
    .then((id)=>get_customer(id));
}

export const get_addresses_of_customer = (customer_id) => {
    return knex.select().from('Address').where('Address.customer_id', customer_id)
}

export const get_customer = (id) => {
    return knex.select().from('Customer').where('id', id)
    .then((rows) => {
        return rows.pop();
    })
}

export const get_customers = () => {
    return knex.select().from('Customer');
}

export const get_invoices_of_customer = (customer_id) => {
    return knex.select().from('Invoice').where('Invoice.customer_id', customer_id)
}

export const get_payments_of_customer = (customer_id) => {
    return knex.select().from('Payment').where('Payment.customer_id', customer_id)
}

export const get_recurring_services_of_address = (address_id) => {
    return knex.select().from('RecurringService').where('address_id', address_id);
}

export const get_services_of_invoice = (invoice_id) =>{
    return knex.select().from('Service').where('invoice_id', invoice_id);
}

export const get_services_of_address = (address_id) =>{
    return knex.select().from('Service').where('address_id', address_id);
}

export const get_data = (type, id) => {
    return knex.select().from(type).where('id', id)
    .then((rows) => {
        let row = rows[0];
        row.model = type;
        return row;
    })
}

