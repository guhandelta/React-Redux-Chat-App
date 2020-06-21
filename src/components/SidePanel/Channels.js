import React, { Component } from 'react'
import { connect } from 'react-redux'
import firebase from '../../firebase'
import { setCurrentChannel } from '../../actions'
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react'

class Channels extends Component {
    state = {
        user: this.props.currentUser,
        channels: [],
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        modal: false,
        firstLoad: true,
        activeChannel: ''
    }

    componentDidMount() {
        // Add listeners when he component is mounted into
        this.addListeners();
    }

    componentWillMount() {
        // Remove the active listeners when a new route is visited and this component is unmounted
        this.removeListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        // Add an event listener to the channelsRef from state, using the on() and listen for child_added event
        this.state.channelsRef.on('child_added', snap => { //snap callBack helps to ge the info abt every new child added
            loadedChannels.push(snap.val()); //snap.val() => The new piece of data added to the channelsRef
            console.log(loadedChannels);
            this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
        })
    }

    removeListeners = () => {
        // off() removes the active listeners/refs/childRefs on the element
        this.state.channelsRef.off();
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if (this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
        }
        this.setState({ firstLoad: false });
    }

    addChannel = () => {
        const { channelsRef, channelDetails, channelName, user } = this.state;
        // Creating unique key for each new channel added
        const key = channelsRef.push().key;// Get the key property from calling push(), which is the unique id given when calling push()

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        }

        channelsRef
            .child(key)
            .update(newChannel) //Pass new channel onto that key
            .then(() => {
                this.setState({ channelName: '', channelDetails: '' });
                //Clearing the channel name & details || can make those 2 values as controlled input
                this.closeModal();
                console.log('Channel Added Successfully!!');
            })
            .catch(err => console.error(err));
    }

    displayChannels = channels => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={channel.id === this.state.activeChannel}
            >
                # {channel.name}
            </Menu.Item>
        ))
    )

    openModal = () => this.setState({ modal: true });
    closeModal = () => this.setState({ modal: false });

    // Fn() to add a channel to the global state tree
    handleChange = event => this.setState({ [event.target.name]: event.target.value });

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
    }

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    }

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.addChannel();
        }
    }

    isFormValid = ({ channelName, channelDetails }) => channelDetails && channelName

    render() {
        const { channels, modal } = this.state;
        return (
            <React.Fragment>
                <Menu.Menu className="menu">
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" /> CHANNELS
                    </span>
                    ({channels.length}) <Icon name="add" onClick={this.openModal} />
                    </Menu.Item>
                    {this.displayChannels(channels)}
                </Menu.Menu>

                {/* Add Channel Modal */}
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="Channel Name"
                                    name="channelName"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="Channel Details"
                                    name="channelDetails"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.handleSubmit}>
                            <Icon name="checkmark" /> Add
                    </Button>
                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove" /> Cancel
                    </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        )
    }
}

export default connect(
    null,
    { setCurrentChannel }
)(Channels);
