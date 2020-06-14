import React, { Component } from 'react'
import { Segment, Comment } from 'semantic-ui-react'
import firebase from '../../firebase'

import Message from './Message'
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'

class Messages extends Component {

    state = {
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages: [],
        messagesLoading: true //To keep track of when the messages are loaded
    }

    componentDidMount() {
        // Check to see if any value for Channel and User is available, in the global state, when the component mounts
        const { channel, user, messages } = this.state;

        if (channel && user) {
            this.addListeners(channel.id); //Pass down the id of the current active channel
        }
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    }

    addMessageListener = channelId => {
        let loadedMessages = [];
        this.state.messagesRef.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            });
        })
    }

    displayMessages = messages => (
        messages.length && messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ))
    )

    render() {
        const { messagesRef, channel, user, messages } = this.state;
        return (
            <React.Fragment>
                <MessagesHeader />

                <Segment>
                    <Comment.Group className="messages">
                        {this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>
                {/* Passing in the messageRef as a prop, to allow creating messages in MessageForm */}
                <MessageForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                />
            </React.Fragment>
        )
    }
}
export default Messages;
