import React, { Component } from 'react'
import { Segment, Comment, SearchResults } from 'semantic-ui-react'
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
        totalUniqueUsers: '',
        searchTerm: '',
        searchResults: [],
        searchLoading: false
    }

    componentDidMount() {
        // Check to see if any value for Channel and User is available, in the global state, when the component mounts
        const { channel, user } = this.state;

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

    handleSearchChange = event => this.setState({ searchTerm: event.target.value, searchLoading: true }, () => this.handleSearchMessages())

    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi'); // 'go' flag => apply the regex globally with case insensitivity
        const searchResults = channelMessages.reduce((acc, message) => {
            if (message.content && message.content.match(regex) || message.user.name.match(regex)) { //Search for text in message or user
                acc.push(message);
            }
            return acc;
        }, []);
        this.setState({ searchResults });
        setTimeout(() => this.setState({ searchLoading: false }), 800);
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
        // prettier-ignore
        const { messagesRef, channel, user, messages, totalUniqueUsers, searchTerm, searchResults, searchLoading } = this.state;
        return (
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    totalUniqueUsers={totalUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    searchLoading={searchLoading}
                />

                <Segment>
                    <Comment.Group className="messages">
                        {/* Display the search results if a serchTerm is mentioned or display the complete messages */}
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
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
