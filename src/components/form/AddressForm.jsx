import React from 'react';
import RecurringServiceForm from './RecurringServiceForm';

export default class AddressForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            description: '',
            address: '',
            is_billing_address: false,
            services: [<RecurringServiceForm/>],
            activeServices: [true]
        }
    }

    handleChange = (event) => {
        let next_state = this.state;
        next_state[event.target.name] = event.target.value;
        this.setState(next_state);
    }

    addService = (event) => {
        let state = this.state;
        state.services.push(<RecurringServiceForm/>)
        state.activeServices.push(true);
        this.setState(state);
    }

    removeService = (event) => {
        let state = this.state;
        state.activeServices[event.target.id] = false;
        this.setState(state);
    }

    render() {
        return (
            <div>
            <h2>Address</h2>
            <div>
                <span>Description</span>
                <input type='text' name='description' value={this.state.description} onChange={this.handleChange}/>
            </div>
            <div>
                <span>Address</span>
                <input type='text' name='address' value={this.state.address} onChange={this.handleChange}/>
            </div>
            <div>
                <span>Is this the Billing Address?</span>
                <input type='checkbox' name='is_billing_address' value={this.state.is_billing_address} onChange={this.handleChange}/>
            </div>
            {this.state.services.map((service, i)=>{
                if(this.state.activeServices[i]){
                    return (
                    <div key={i}>
                        {service}
                        <input type='button' value='Remove Recurring Service' onClick={this.removeService} id={i} />
                    </div>
                    );
                }
            })}
            <input type='button' value='Add Recurring Service' onClick={this.addService} /> 
            </div>
        );
    }
}
