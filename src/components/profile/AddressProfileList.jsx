import React from 'react';
import Relay from 'react-relay';

import AddressProfile from './AddressProfile';

class AddressProfileList extends React.Component {
  render() {
    return (
      <div>
        <h2>Addresses</h2>
        {this.props.addresses.edges.map((edge, index)=>{
            return <AddressProfile address={edge.node} key={index}/>    
        })}
      </div>
    );
  }
}

export default Relay.createContainer(AddressProfileList, {
  fragments: {
    addresses: () => Relay.QL `
      fragment on AddressConnection {
        edges{
            node{
                ${AddressProfile.getFragment('address')}                
            }

        }
    }`
  },
});
