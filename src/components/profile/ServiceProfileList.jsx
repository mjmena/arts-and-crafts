import React from 'react';
import Relay from 'react-relay';

import ServiceProfile from './ServiceProfile';

class ServiceProfileList extends React.Component {
  render() {
    return (
      <div>
        <h3>Services</h3>
        {this.props.services.edges.map((edge, index)=>{
            return <ServiceProfile service={edge.node} key={index}/>    
        })}
      </div>
    );
  }
}

export default Relay.createContainer(ServiceProfileList, {
  fragments: {
    services: () => Relay.QL `
      fragment on ServiceConnection {
        edges{
            node{
                ${ServiceProfile.getFragment('service')}                
            }

        }
    }`
  },
});
