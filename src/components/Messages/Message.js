import React from 'react'
import { Comment, Image } from 'semantic-ui-react'
import moment from 'moment'

// Checking if the currently authenticated user id and id f user that created the msg are teh same
const isOwnMessage = (message, user) => message.user.id === user.uid ? 'message__self' : ''

const timeFromNow = timestamp => moment(timestamp).fromNow();

const hasImage = (message) => {
    return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
}

const Message = ({ message, user }) => (
    <Comment>
        <Comment.Avatar src={message.user.avatar} />
        <Comment.Content className={isOwnMessage(message, user)}>
            <Comment.Author as="a">{message.user.name}</Comment.Author>
            <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
            {
                hasImage(message) ?
                    <Image src={message.image} className="message__image" />
                    :
                    <Comment.Text>{message.content}</Comment.Text>
            }
        </Comment.Content>
    </Comment>
)

export default Message
