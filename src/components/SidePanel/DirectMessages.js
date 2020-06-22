import React, { Component } from 'react'
import firebase from '../../firebase'
import { Menu, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux';

class DirectMessages extends Component {
    state = {
        user: this.props.currentUser,
        users: [],
        usersRef: firebase.database().ref('users'),
        connectedRef: firebase.database().ref('.info/connected'), //Users connection status
        presenceRef: firebase.database().ref('presence'), //Users presence
    }

    componentDidMount() {
        if (this.state.user) {
            this.addListeners(this.state.user.uid);
        }
    }

    addListeners = currentUserUid => {
        let loadedUsers = [];
        this.state.usersRef.on('child_added', snap => {
            if (currentUserUid !== snap.key) { // Makingsure not to add the current authneticated into the list of loaded users
                let user = snap.val();
                user['uid'] = snap.key;
                user['status'] = 'offline';
                loadedUsers.push(user);
                this.setState({ users: loadedUsers }); //Add the user to loadedUsers
            }
        });

        this.state.connectedRef.on('value', snap => {
            if (snap.val() === true) {
                const ref = this.state.presenceRef.child(currentUserUid);
                ref.set(true);
                ref.onDisconnect().remove(err => { //Remove the user from the collection of loaded users, if the user disconnets
                    if (err !== null) console.error(err);
                })
            }
        })

        this.state.presenceRef.on('child_added', snap => {
            if (currentUserUid !== snap.key) {
                this.addStatusToUser(snap.key)
            }
        })
        this.state.presenceRef.on('child_removed', snap => {
            if (currentUserUid !== snap.key) {
                this.addStatusToUser(snap.key, false)
            }
        })
    }

    addStatusToUser = (userId, connected = true) => {
        const updatedUsers = this.state.users.reduce((acc, user) => {
            if (user.uid === userId) {
                user['status'] = `${connected ? 'online' : 'offline'}`;
            }
            return acc.concat(user);
        }, [])
        this.setState({ users: updatedUsers });
    }

    isUserOnline = user => user.status === 'online';

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
                {users.map(user => (
                    <Menu.Item
                        key={user.uid}
                        onClick={() => console.log(user)}
                        style={{ opacity: 0.7, fontStyle: 'italic' }}
                    >
                        <Icon
                            name="circle"
                            color={this.isUserOnline(user) ? 'green' : 'red'}
                        />
                        @ {user.name}
                    </Menu.Item>
                ))}
            </Menu.Menu>
        )
    }
}

export default DirectMessages

