import React from 'react';
import Relay from 'react-relay';
import moment from 'moment';

class RecurringServiceProfile extends React.Component {
  render() {
    const recurring_service = this.props.recurring_service;
    
    let Recurrence = null; 
    if(recurring_service.type === 'week'){
        Recurrence = (
            <div>
                Weekly on {moment.weekdays()[recurring_service.day]}
            </div>
        )
    }else if(recurring_service.type === 'Biweekly'){
        Recurrence = (
            <div>
                Biweekly on {moment.weekdays()[recurring_service.day]}
            </div>
        )
    }else if(recurring_service.type === 'Yearly'){
        Recurrence = (
            <div>
                Yearly during the {recurring_service.week} week in {moment.months()[recurring_service.month]} on {moment.weekdays()[recurring_service.day]}
            </div>
        )
    }
      
    return (
      <div>
        <div>
            Description: {this.props.recurring_service.description}
        </div>
        <div>
            Cost: {this.props.recurring_service.cost}
        </div>
        {Recurrence}
      </div>
    );
  }
}

export default Relay.createContainer(RecurringServiceProfile, {
  fragments: {
    recurring_service: () => Relay.QL `
      fragment on RecurringService {
        description
        cost
        type
        day
        week
        month
    }`
  },
});