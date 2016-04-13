import React from 'react';
import moment from 'moment';
export default class RecurringServiceForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            description: '',
            cost: '',
            type: 'BiWeekly',
            day: 0
        }
    }

    handleChange = (event) => {
        let next_state = this.state;
        next_state[event.target.name] = event.target.value;
        this.setState(next_state);
    }

    render() {
        return (
            <div>
                <h2>Recurring Service</h2>
                <div>
                    <span>Description</span>
                    <input type='text' name='description' value={this.state.description} onChange={this.handleChange}/>
                </div>
                <div>
                    <span>Address</span>
                    <input type='text' name='cost' value={this.state.cost} onChange={this.handleChange}/>
                </div>
                <div>
                    <span>Type</span>
                    <select value={this.state.type} name='type' onChange={this.handleChange}>
                        <option value='Weekly'>Weekly</option>
                        <option value='Biweekly'>Biweekly</option>
                    </select>
                </div>
                <div>
                    <span>Day</span>
                    <select value={this.state.day} name='day' onChange={this.handleChange}>
                        { moment.weekdays().map((day, index) => {
                            return <option key={index} value={index}>{day}</option>
                        })}
                    </select>
                </div>
            </div>
        );
    }
}
