import React from 'react'
import { Grid } from 'semantic-ui-react'
import { connect } from 'react-redux'
import './App.css'

import ColorPanel from './ColorPanel/ColorPanel'
import SidePanel from './SidePanel/SidePanel'
import MetaPanel from './MetaPanel/MetaPanel'
import Messages from './Messages/Messages'

const App = ({ currentUser, currentChannel }) => (
  <Grid columns="equal" className="app" style={{ background: "#eee" }}>
    <ColorPanel />
    <SidePanel
      key={currentUser && currentUser.id} //Need to provide a unique identifier, when passing in multiple props-
      currentUser={currentUser}
    />
    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages
        key={currentChannel && currentChannel.id} //Need to provide a unique identifier, when passing in multiple props-
        //- The current channel id is used here as a unique identifier
        currentChannel={currentChannel}
        currentUser={currentUser}
      />
    </Grid.Column>
    <Grid.Column width={4}>
      <MetaPanel />
    </Grid.Column>
  </Grid>
)


const mapStateToProps = state => ({ //Can also destructurize the state passed in as param
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel
});

export default connect(mapStateToProps)(App);
