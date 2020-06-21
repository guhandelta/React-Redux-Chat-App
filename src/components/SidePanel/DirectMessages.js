import React, { Component } from 'react'
import { Menu, Icon } from 'semantic-ui-react'

class DirectMessages extends Component {
    state = {
        users: []
    }
    render() {
        const { users } = this.state;
        return (
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                        <Icon name="mainl" /> DIRECT MESSAGE
                    </span>&emsp;
                    ({users.length}) {/* Number of available direct messages channels */}
                </Menu.Item>
                {/* Users available to send direct messages */}
            </Menu.Menu>
        )
    }
}

export default DirectMessages

