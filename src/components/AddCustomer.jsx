import React from 'react';
import Relay from 'react-relay'

import AddressForm from './form/AddressForm';

export default class AddCustomer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            addressForms: [<AddressForm/>],
            activeAddressForms: [true]
        }
    }

    handleChange = (event) => {
        let next_state = this.state;
        next_state[event.target.name] = event.target.value;
        this.setState(next_state);
    }

    handleAddAddressForm = (event) => {
        let state = this.state;
        state.addressForms.push(<AddressForm/>)
        state.activeAddressForms.push(true);
        this.setState(state);
    }

    handleRemoveAddressForm = (event) => {
        let state = this.state;
        state.activeAddressForms[event.target.id] = false;
        this.setState(state);
    }

    handleSubmit = (event) => {
        console.log(this.state.name)
        Relay.Store.commitUpdate(
            new AddCustomerMutation({
                name: this.state.name
            })
        );
    }

    render() {
        return (
            <div>
                <h2>New Customer</h2>
                <form> 
                    <div>
                        <span>Name</span>
                        <input type='text' name='name' value={this.state.name} onChange={this.handleChange}/>
                    </div>
                    {this.state.addressForms.map((addressForm, i)=>{
                        if(this.state.activeAddressForms[i]){
                            return (
                            <div key={i}>
                                {addressForm}
                                <input type='button' value='Remove Address' onClick={this.handleRemoveAddressForm} id={i} />
                            </div>
                            );
                        }
                    })}
                    <input type='button' value='Add Address' onClick={this.handleAddAddressForm} />
                    <input type='button' value='Submit' onClick={this.handleSubmit} />      
                </form>
            </div>
        );
    }
}

class AddCustomerMutation extends Relay.Mutation {
    getMutation() {
        return Relay.QL `mutation { addCustomer }`;
    }

    getVariables() {
        return {
            name: this.props.name
        };
    }

    getConfigs() {
        return [{
            type: 'REQUIRED_CHILDREN',
            children: [Relay.QL `
            fragment on AddCustomerPayload {
                customer{
                    id
                }
                viewer{
                    customers
                }
            }`],
        }];
    }

    getFatQuery() {
        return Relay.QL `
          fragment on AddCustomerPayload {
            customer
          }
        `;
    }

}
