import React from 'react'
import { Comment } from 'semantic-ui-react'
import moment from 'moment'

// Checking if the currently authenticated user id and id f user that created the msg are teh same
const isOwnMessage = (message, user) => message.user.id === user.uid ? 'message__self' : ''

const timeFromNow = timestamp => moment(timestamp).fromNow();

const Message = ({ message, user }) => (
    <Comment>
        <Comment.Avatar src={message.user.avatar} />
        <Comment.Content className={isOwnMessage(message, user)}>
            <Comment.Author as="a">{message.user.name}</Comment.Author>
            <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
            <Comment.Text>{message.content}</Comment.Text>
        </Comment.Content>
    </Comment>
)

export default Message
