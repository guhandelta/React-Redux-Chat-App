import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import UserPanel from './UserPanel'
import Channels from './Channels'

class SidePanel extends Component {
    render() {
        const { currentUser } = this.props;
        return (
            <div>
                <Menu
                    size="large"
                    inverted
                    fixed="left"
                    vertical
                    style={{ background: '#4c3c4c', fontSize: '1.2rem', marginLeft: '3em', paddingLeft: '1em', paddingRight: '1em' }}
                >
                    <UserPanel currentUser={currentUser} />
                    <Channels currentUser={currentUser} />
                </Menu>
            </div>
        )
    }
}

export default SidePanel;
