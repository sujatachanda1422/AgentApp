import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Button, Alert, ActivityIndicator, ImageBackground } from 'react-native';
import firebase from '../database/firebase';
let user = null;
const image = require("../images/bkg.jpg");

export default class Signup extends Component {
  db: firebase.firestore.Firestore;

  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      isLoading: false
    };

    this.db = firebase.firestore();
  }

  UNSAFE_componentWillMount() {
    user = this.props.route.params.user;
    user.confirmPassword = user.password;
    console.log('Profile', user);

    if (user) {
      this.setState(user);

      this.props.navigation.setOptions({
        title: 'Profile'
      });
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  validateForm() {
    let valid = true;
    const mailformat = /\S+@\S+\.\S+/;

    if (this.state.email === '' ||
      this.state.password === '' || this.state.confirmPassword === '') {
      valid = false;
      Alert.alert('', 'Enter all the details to signup!');
    } else if (!this.state.email.match(mailformat)) {
      valid = false;
      Alert.alert('', 'Please enter a valid email');
    } else if (this.state.password !== this.state.confirmPassword) {
      valid = false;
      Alert.alert('', 'Password does not match');
    }

    return valid;
  }

  registerUser = () => {
    if (!this.validateForm()) {
      return;
    }

    this.setState({
      isLoading: true
    });

    this.db.collection("agent_list").add({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef);
        docRef.update({ uid: docRef.id });

        this.props.navigation.navigate('Login', { email: this.state.email });

        this.setState({
          isLoading: false,
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }

  updateUser = () => {
    if (!this.validateForm()) {
      return;
    }
    this.setState({
      isLoading: true
    });

    this.db.collection("agent_list").doc(user.uid).update({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    })
      .then(_ => {
        Alert.alert('', 'Profile updated');
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <ImageBackground source={image} style={styles.image}>
          <View style={styles.overlay}>
            <TextInput
              style={styles.inputStyle}
              placeholder="Name"
              value={this.state.name}
              onChangeText={(val) => this.updateInputVal(val, 'name')}
            />
            <TextInput
              style={styles.inputStyle}
              placeholder="Email"
              value={this.state.email}
              onChangeText={(val) => this.updateInputVal(val, 'email')}
            />
            <TextInput
              style={styles.inputStyle}
              placeholder="Password"
              value={this.state.password}
              onChangeText={(val) => this.updateInputVal(val, 'password')}
              maxLength={15}
              secureTextEntry={true}
            />
            <TextInput
              style={styles.inputStyle}
              placeholder="Confirm Password"
              value={this.state.confirmPassword}
              onChangeText={(val) => this.updateInputVal(val, 'confirmPassword')}
              maxLength={15}
              secureTextEntry={true}
            />
            {user === null &&
              <Button
                color="#3740FE"
                title="Sign Up"
                onPress={() => this.registerUser()}
              />
            }
            {user !== null &&
              <Button
                color="#3740FE"
                title="Update"
                onPress={() => this.updateUser()}
              />
            }
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  overlay: {
    backgroundColor: 'rgba(199,199,199,0.3)',
    height: '100%',
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  inputStyle: {
    width: '100%',
    marginBottom: 25,
    padding: 10,
    alignSelf: "center",
    backgroundColor: '#fff',
    borderRadius: 2
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});