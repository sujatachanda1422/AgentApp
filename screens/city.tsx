import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import firebase from '../database/firebase';

export default class AddCity extends Component {
  db: firebase.firestore.Firestore;

  constructor() {
    super();
    this.state = {
      name: ''
    };

    this.db = firebase.firestore();
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  capitalizeCity(string: string) {
    return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
  }

  addCity = () => {
    const city = this.state.name.trim().toLowerCase();

    if (!city) {
      Alert.alert('', 'Please enter a valid name');
      return;
    }

    const db = this.db.collection("city_list").doc(city);

    db.get()
      .then(doc => {
        if (doc.exists) {
          Alert.alert('', 'This city already exists. Please try another.');
        } else {
          db.set({
            name: this.capitalizeCity(city)
          });
          Alert.alert('', 'City added successfully!');
        }
        this.setState({ name: '' });
      })
      .catch(function (error) {
        console.log("Error adding document: ", error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.overlay}>
          <TextInput
            style={styles.inputStyle}
            placeholder="Enter city name"
            value={this.state.name}
            onChangeText={(val) => this.updateInputVal(val, 'name')}
          />

          <Button
            color="#3740FE"
            title="Add"
            onPress={() => this.addCity()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: '#aac8dc'
  },
  overlay: {
    backgroundColor: 'rgba(199,199,199,0.3)',
    height: '100%',
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  inputStyle: {
    width: '100%',
    marginBottom: 25,
    padding: 10,
    alignSelf: "center",
    backgroundColor: '#fff',
    borderRadius: 2,
    color: '#000'
  }
});