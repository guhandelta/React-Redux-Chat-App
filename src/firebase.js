import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var config = {
    apiKey: "AIzaSyD411dg7YsK37bMaI8pnN2ZuIbOsn8jl50",
    authDomain: "https://ngpreactreduxslackchatapp.firebaseapp.com/",
    databaseURL: "https://ngpreactreduxslackchatapp.firebaseio.com",
    projectId: "ngpreactreduxslackchatapp",
    storageBucket: "ngpreactreduxslackchatapp.appspot.com",
};

firebase.initializeApp(config);

export default firebase;
