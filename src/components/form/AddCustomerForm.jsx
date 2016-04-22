import React from 'react';
import Relay from 'react-relay';
import {
    browserHistory
}
from 'react-router';
import AddCustomerMutation from '../../mutations/AddCustomerMutation';
import AddAddressMutation from '../../mutations/AddAddressMutation';

import Immutable from 'immutable';
import moment from 'moment';

const Address = Immutable.Record({
    description: '',
    location: '',
    is_billing_address: false,
    services: Immutable.List()
});

const Service = Immutable.Record({
    description: '',
    cost: '',
    type: 'Weekly',
    day: 0,
    week: 'First',
    month: 0
});

class AddCustomer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            immutable : Immutable.Map({
                name: '',
                addresses: Immutable.List()
            })
        };
    }

    handleChange = (key_path, event) => {
        key_path.push(event.target.name);
        
        let value = event.target.value;
        if(event.target.type === 'checkbox'){
            value = event.target.checked;   
        }
        
        this.setState({immutable: this.state.immutable.setIn(key_path, value)});
    }

    handleSubmit = (event) => {
        const customer = this.state.immutable;
        
        let onFailure = (transaction) => {
            console.log('Failure!' + JSON.stringify(transaction.getError().source));
        };
        
        let onSuccess = (response) => {
            console.log('Successfully added Customer!');
            console.log(response.addCustomer.customerEdge.node.id)
            customer.get('addresses').forEach((address) => {
                Relay.Store.commitUpdate(
                    new AddAddressMutation({
                        customer_id: response.addCustomer.customerEdge.node.id,
                        description: address.get('description'),
                        location: address.get('location'),
                        is_billing_address: address.get('is_billing_address')
                    }), {
                        onFailure:onFailure,
                        onSuccess: (response) =>{
                            console.log(response.addAddress.addressEdge.node.id);
                        }}
                ) 
            });
            
            browserHistory.push(`/`);
        };
        
    console.log(this.props.viewer); 
        Relay.Store.commitUpdate(
            
            new AddCustomerMutation({
                viewer_id: this.props.viewer.id,
                name: customer.get('name')
            }), {
                onSuccess: onSuccess, onFailure: onFailure
            }
        );
    }   

    addAddress = (event) => {
        this.setState({
            immutable: this.state.immutable.updateIn(['addresses'], (addresses) => {
                return addresses.push(new Address());
            })
        });
    }
    
    addService = (key_path, event) => {
        this.setState({
            immutable: this.state.immutable.updateIn(key_path, (services) => {
                return services.push(new Service());
            })
        });
    }
    
    removeAddress = (key_path, event) => {
        this.setState({
            immutable: this.state.immutable.removeIn(key_path)
        });
    }
    
    removeService = (key_path, event) => {
        this.setState({
            immutable: this.state.immutable.removeIn(key_path)
        });
    }

    render() {
        const customer = this.state.immutable;
        const handleCustomerChange = this.handleChange.bind(this, []);
        return (
            <div>
                <h2>New Customer</h2>
                <form> 
                    <div>
                        <span>Name</span>
                        <input type='text' name='name' value={customer.get('name')} onChange={handleCustomerChange}/>
                    </div>
                    {
                        customer.get('addresses').map((address, address_index)=>{
                        const handleAddressChange = this.handleChange.bind(this, ['addresses', address_index]);
                            return (
                                <div key={address_index}>
                                    <h2>Address</h2>
                                    <div>
                                        <span>Description</span>
                                        <input type='text' name='description' value={address.description} onChange={handleAddressChange}/>
                                    </div>
                                    <div>
                                        <span>Address</span>
                                        <input type='text' name='location' value={address.location} onChange={handleAddressChange}/>
                                    </div>
                                    <div>
                                        <span>Is this the Billing Address?</span>
                                        <input type='checkbox' name='is_billing_address' value={address.is_billing_address} onClick={handleAddressChange}/>
                                    </div>
                                    {
                                        address.services.map((service, service_index)=> {
                                            const handleServiceChange = this.handleChange.bind(this, ['addresses', address_index, 'services', service_index]);
                                            let Recurrence = null;
                                            if (service.type === 'Yearly') {
                                                Recurrence = (
                                                    <div>
                                                        <div>
                                                            <span>Month</span>
                                                            <select value={service.month} name='month' onChange={handleServiceChange}>
                                                                { moment.months().map((month, index) => {
                                                                    return <option key={index} value={index}>{month}</option>
                                                                })}
                                                            </select>
                                                        </div>
                                                        
                                                        <div>
                                                            <span>Week</span>
                                                            <select value={service.week} name='week' onChange={handleServiceChange}>
                                                                <option value='First'>First</option>
                                                                <option value='Second'>Second</option>
                                                                <option value='Third'>Third</option>
                                                                <option value='Fourth'>Fourth</option>
                                                                <option value='Last'>Last</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                    
                                            return (
                                                <div key={service_index}>
                                                    <h2>Recurring Service</h2>
                                                    <div>
                                                        <span>Description</span>
                                                        <input type='text' name='description' value={service.description} onChange={handleServiceChange}/>
                                                    </div>
                                                    <div>
                                                        <span>Cost</span>
                                                        <input type='text' name='cost' value={service.cost} onChange={handleServiceChange}/>
                                                    </div>
                                                    <div>
                                                        <span>Type</span>
                                                        <select value={service.type} name='type' onChange={handleServiceChange}>
                                                            <option value='Weekly'>Weekly</option>
                                                            <option value='Biweekly'>Biweekly</option>
                                                            <option value='Yearly'>Yearly</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        {Recurrence}
                                                        <span>Day</span>
                                                        <select value={service.day} name='day' onChange={handleServiceChange}>
                                                            { moment.weekdays().map((day, index) => {
                                                                return <option key={index} value={index}>{day}</option>
                                                            })}
                                                        </select>
                                                    </div>
                                                    <input type='button' value='Remove Service' onClick={this.removeService.bind(this, ['addresses', address_index, 'services', service_index])} />

                                                </div>
                                            );
                                        })
                                    }
                                    <input type='button' value='Add Service' onClick={this.addService.bind(this, ['addresses', address_index, 'services'])} />
                                    <input type='button' value='Remove Address' onClick={this.removeAddress.bind(this, ['addresses', address_index])} />  
                                </div>
                            )
                            
                        })
                        
                        
                    }
                    <input type='button' value='Add Address' onClick={this.addAddress} />
                    <input type='button' value='Submit' onClick={this.handleSubmit} />      
                </form>
                <pre>{JSON.stringify(customer.toJSON(), null, 2)}</pre>
            </div>
        );
    }
}

export default Relay.createContainer(AddCustomer, {
  fragments: {
    viewer: () => Relay.QL `
      fragment on Viewer {
        id
      }`
  },
});


