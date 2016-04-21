import React from 'react';

export default class AddressForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            address: '',
            is_billing_address: false,
        };
    }

    handleChange = (event) => {
        let next_state = this.state;
        next_state[event.target.name] = event.target.value;
        this.setState(next_state);
    }

    render() {
        return (
            <div>
                <h2>Address</h2>
                <form>
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
                </form>
            </div>
        );
    }
}
