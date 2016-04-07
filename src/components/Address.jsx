import React from 'react';

import Relay from 'react-relay';

class Address extends React.Component {
  render() {
    return (
      <div>
        {this.props.address.address}
      </div>
    );
  }
}

export default Relay.createContainer(Address, {
  fragments: {
    address: () => Relay.QL `
      fragment on Address {
        description
        address
      }`
  },
});
