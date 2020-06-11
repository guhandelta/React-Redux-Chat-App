import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Form, Segment, Button, Message, Header, Icon } from 'semantic-ui-react'

import firebase from '../../firebase'

class Register extends Component {
    state = {
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: []
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }

    isPasswordValid = ({ password, passwordConfirmation }) => {
        // var letters = /^[0-9a-zA-Z]+$/;
        // if(inputtxt.value.match(letters))
        if (password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        } else if (password !== passwordConfirmation) {
            return false;
        } else {
            return true;
        }
    }

    isFormValid = () => {
        let errors = [];
        let error;
        if (this.isFormEmpty(this.state)) {
            error = { message: 'Fill in all the fields' }
            this.setState({ errors: errors.concat(error) });
            return false;
        } else if (!this.isPasswordValid(this.state)) {
            error = { message: 'Password is invalid' }
            this.setState({ errors: errors.concat(error) });
            return false;
        } else {
            //Form valid
            return true;
        }
    }

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

    handleSubmit = event => {
        if (this.isFormValid()) {
            event.preventDefault();
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => console.log(createdUser)) //Since this is a promise, get current created user as createdUser
                .catch(err => console.error(err));

        }
    }

    render() {
        const { username, email, password, passwordConfirmation, errors } = this.state;
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="örange" textAlign="center">
                        <Icon name="puzzle piece" color="örange" />
                        Register for DevChat
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input fluid name="username" icon="user" iconPosition="left"
                                placeholder="Username" onChange={this.handleChange} value={username} type="text" />
                            <Form.Input fluid name="email" icon="mail" iconPosition="left"
                                placeholder="Email Address" onChange={this.handleChange} value={email} type="email" />
                            <Form.Input fluid name="password" icon="lock" iconPosition="left"
                                placeholder="Password" onChange={this.handleChange} value={password} type="password" />
                            <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left"
                                placeholder="Confirm Password" onChange={this.handleChange} value={passwordConfirmation} type="password" />
                            <Button color="orange" fluid size="large">Submit</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>Already a User?&nbsp;<Link to="/login">Login</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}
export default Register;
