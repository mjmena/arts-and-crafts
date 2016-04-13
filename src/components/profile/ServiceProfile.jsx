import React from 'react';
import Relay from 'react-relay';

import moment from 'moment';

class ServiceProfile extends React.Component {
  render() {
    const service = this.props.service;
    
    let ServiceDate = null;
    if(service.end === null){
      ServiceDate = (
        <div>
            Date: {moment(service.start).format()}
        </div>
      )
    }else{
      ServiceDate = (
      <div>
        <div>
            Start: {moment(service.start).format()}
        </div>
        <div>
          End: {service.end}
        </div>
      </div>
      )
    }
    return (
      <div>
        <div>
          Description: {service.description}
        </div>
        <div>
          Amount: {service.cost}
        </div>
        {ServiceDate}
      </div>
    );
  }
}

export default Relay.createContainer(ServiceProfile, {
  fragments: {
    service: () => Relay.QL `
      fragment on Service {
        description
        cost
        start
        end
      }`
  },
});
