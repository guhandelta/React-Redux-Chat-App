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
        messagesLoading: true, //To keep track of when the messages are loaded
        totalUniqueUsers: ''
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
            this.countUniqueUsers(loadedMessages);
        })
    }

    countUniqueUsers = messages => {
        //accumulator, value used for iterating
        const uniqueUsers = messages.reduce((acc, message) => {

            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc; //return the accumulator
        }, []);
        const plural = uniqueUsers.length > 1 || uniqueUsers === 0;
        const totalUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`;
        this.setState({ totalUniqueUsers })
    }

    // Fn() to change the name and number of users for the channel, the user is currently on, within the header
    displayChannelName = channel => channel ? `#${channel.name}` : '';

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
        const { messagesRef, channel, user, messages, totalUniqueUsers } = this.state;
        return (
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    totalUniqueUsers={totalUniqueUsers}
                />

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
