import React, { Component } from 'react'
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react'
import firebase from '../../firebase'

class UserPanel extends Component {

    state = {
        user: this.props.currentUser
        // Easier approach to map/set the values, instead of doing it in a lifecycle hook like didMount or willRecieveProps
    }

    dropDownOptions = () => [
        {
            key: "user",
            text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true
        },
        {
            key: 'avatar',
            text: <span>Change Avatar</span>
        },
        {
            key: 'signout',
            text: <span onClick={this.handleUserSignout}>Sign Out </span>
        }
    ]

    handleUserSignout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log("User Signed Out"))
    };

    render() {
        console.log(this.state.user);

        const { user } = this.state;

        return (
            <Grid style={{ background: '#4c3c4c' }}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: 0, }}>
                        {/* Main App Header */}
                        <Header inverted floated="left" as="h2">
                            <Icon name="code" />
                            <Header.Content>DevChat</Header.Content>
                        </Header>
                        {/* User Dropdown */}
                        <Header style={{ padding: '0.1em' }} as="h4" inverted>
                            <Dropdown trigger={
                                <span>
                                    <Image src={user.photoURL} spaced="right" avatar />
                                    {user.displayName}
                                </span>
                            } options={this.dropDownOptions()} />
                        </Header>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({ //Can also destructurize the state passed in as param
    currentUser: state.user.currentUser
});

export default UserPanel;
