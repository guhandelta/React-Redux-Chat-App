import React, { Component } from 'react'
import firebase from '../../firebase'
import { Segment, Button, Input } from 'semantic-ui-react'

class MessageForm extends Component {

    state = {
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: []
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    createMessage = () => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP, //Timestamp when the message was created
            user: {
                id: this.state.user.uid, // user id of the current user as the id
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
            content: this.state.message
        };
        return message;
    }

    sendMessage = () => {
        const { messagesRef } = this.props;
        const { message, channel, user } = this.state;

        if (message) {
            messagesRef
                .child(channel.id)// To specify, to whihc channel would this message be added to
                .push()//messagesRef) // Push the channel id of the channel the user is currently on, into messagesRef
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: '', errors: [] })
                })
                .catch(err => {
                    console.log(err);
                    this.setState({
                        loading: false,
                        errors: this.state.errors.concat(err)
                    })
                })
        } else {
            this.setState({
                errors: this.state.errors.concat({ message: 'Add a message' })
            }, () => console.log(this.state.erros));
        }
    }

    render() {
        const { errors, message, loading } = this.state;
        return (
            <Segment
                clasName="message__form"
            >
                <Input
                    fluid
                    name="message"
                    value={message}
                    onChange={this.handleChange}
                    style={{ marginBottom: '0.7em' }}
                    label={<Button icon={'add'} />}
                    labelPosition="left"
                    className={
                        errors.some(error => error.message.includes("message")) ? "error" : ""
                    }
                    placeholder="Write your Message"
                />{/* Button while be disabled while loading is true || while msg is being added*/}
                <Button.Group icon widths="2">
                    <Button
                        onClick={this.sendMessage}
                        disabled={loading}
                        color="orange"
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                    />
                    <Button
                        color="teal"
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                    />
                </Button.Group>
            </Segment>
        )
    }
}

export default MessageForm;
