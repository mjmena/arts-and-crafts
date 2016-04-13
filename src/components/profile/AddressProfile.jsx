import React from 'react';
import Relay from 'react-relay';
import ServiceProfileList from './ServiceProfileList';
import RecurringServiceProfileList from './RecurringServiceProfileList'
class AddressProfile extends React.Component {
  render() {
    return (
      <div>
        {this.props.address.address}
        <div style={{marginLeft:10}}>
          <ServiceProfileList services={this.props.address.services}/>
          <RecurringServiceProfileList recurring_services={this.props.address.recurring_services} />
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(AddressProfile, {
  fragments: {
    address: () => Relay.QL `
      fragment on Address {
        description
        address
        services(first:10){
          ${ServiceProfileList.getFragment('services')}
        }
        recurring_services(first:10){
          ${RecurringServiceProfileList.getFragment('recurring_services')}

        }
      }`
  },
});
