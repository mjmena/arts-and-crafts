import React from 'react';
import moment from 'moment';
export default class RecurringServiceForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            description: '',
            cost: '',
            type: 'Weekly',
            day: 0,
            week: null,
            month: null
        }
    }

    handleChange = (event) => {
        let next_state = this.state;
        next_state[event.target.name] = event.target.value;
        this.setState(next_state);
    }

    render() {
        let Recurrence = null;
        if (this.state.type === 'Yearly') {
            Recurrence = (
                <div>
                    <div>
                        <span>Month</span>
                        <select value={this.state.month} name='month' onChange={this.handleChange}>
                            { moment.months().map((month, index) => {
                                return <option key={index} value={index}>{month}</option>
                            })}
                        </select>
                    </div>
                    
                    <div>
                        <span>Week</span>
                        <select value={this.state.week} name='week' onChange={this.handleChange}>
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
                        <option value='Yearly'>Yearly</option>
                    </select>
                </div>
                <div>
                    {Recurrence}
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
