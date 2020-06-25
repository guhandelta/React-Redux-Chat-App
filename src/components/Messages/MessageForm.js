import React, { Component } from 'react'
import firebase from '../../firebase'
import uuidv4 from 'uuid/v4'
import ProgressBar from './progressBar'
import FileModal from './FileModal'
import { Segment, Button, Input } from 'semantic-ui-react'

class MessageForm extends Component {

    state = {
        privateChannel: this.props.isPrivateChannel,
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: [],
        modal: false,
        uploadState: '',
        uploadTask: null,
        stroageRef: firebase.storage().ref(), //ref to the firebase storage
        percentUploaded: 0
    }

    openModal = () => this.setState({ modal: true });
    closeModal = () => this.setState({ modal: false });

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP, //Timestamp when the message was created
            user: {
                id: this.state.user.uid, // user id of the current user as the id
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
        };
        // Now messages, both with, content and image properties, so it needs to be determined as which is which
        if (fileUrl !== null) {
            // Set animage property on the message obj, if a fileUrl is passed onto the createMessage()
            message['image'] = fileUrl;
        } else {
            message['content'] = this.state.message;
        }
        return message;
    }

    sendMessage = () => {
        const { getMessagesRef } = this.props;
        const { message, channel, user } = this.state;

        if (message) {
            getMessagesRef()
                .child(channel.id)// To specify, to which channel would this message be added to
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

    getPath = () => {
        if (this.state.privateChannel) {
            return `chat/private-${this.state.channel.id}`;
        } else {
            return 'chat/public';
        }
    }

    uploadFile = (file, metadata) => {
        // To post that image as a message
        const pathToUpload = this.state.channel.id;
        const ref = this.props.getMessagesRef();
        const filePath = `chat/public/${uuidv4()}.jpg`; //Creating unique string as ID for ever image, uploaded

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.stroageRef.child(filePath).put(file, metadata)
        },
            () => {
                this.state.uploadTask.on('state_changed', snap => {
                    const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                    this.setState({ percentUploaded });
                },

                    err => {
                        console.error(err);
                        this.setState({
                            errors: this.state.errors.concat(err),
                            uploadState: 'error',
                            uploadTask: null
                        });

                    },
                    () => { //Callback to ref snapshot -> ref property on uploadTask, to exe getDownloadURL() -> Promise, that allows to-
                        //- get the DownloadURL of the img that has been uploaded to the firebase storage
                        this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                            this.sendFileMessage(downloadURL, ref, pathToUpload);
                        })
                            .catch(err => {
                                console.error(err);
                                this.setState({
                                    errors: this.state.errors.concat(err),
                                    uploadState: 'error',
                                    uploadTask: null
                                });
                            })
                    }

                )
            }
        );
    }

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload) //set a child on the ref
            .push()
            .set(this.createMessage(fileUrl))
            .then(() => {
                this.setState({ uploadState: 'done' })
            })
            .catch(err => {
                console.error(err);
                this.setState({ errors: this.state.errors.concat(err) })
            })
    }

    render() {
        const { errors, message, loading, modal, uploadState, percentUploaded } = this.state;
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
                        disabled={uploadState === "uploading"}
                        onClick={this.openModal}
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                    />
                </Button.Group>
                <FileModal
                    modal={modal}
                    closeModal={this.closeModal}
                    uploadFile={this.uploadFile}
                />
                <ProgressBar
                    uploadState={uploadState}
                    percentUploaded={percentUploaded}
                />
            </Segment>
        )
    }
}

export default MessageForm;
