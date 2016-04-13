import React from 'react';
import Relay from 'react-relay';

import RecurringServiceProfile from './RecurringServiceProfile';

class RecurringServiceProfileList extends React.Component {
  render() {
    return (
      <div>
        <h3>Recurring Services</h3>
        {this.props.recurring_services.edges.map((edge, index)=>{
            return <RecurringServiceProfile recurring_service={edge.node} key={index}/>    
        })}
      </div>
    );
  }
}

export default Relay.createContainer(RecurringServiceProfileList, {
  fragments: {
    recurring_services: () => Relay.QL `
      fragment on RecurringServiceConnection {
        edges{
            node{
                ${RecurringServiceProfile.getFragment('recurring_service')}
            }
        }
    }`
  },
});


