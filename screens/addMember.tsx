import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Button, Text } from 'react-native';
import firebase from '../database/firebase';
import { RadioButton } from 'react-native-paper';

export default class AddMember extends Component {
  db: firebase.firestore.Firestore;

  constructor() {
    super();
    this.state = {
      mobile: '',
      name: '',
      gender: 'male',
      city: '',
      uid: '',
      agentId: ''
    }

    this.db = firebase.firestore();
  }
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  addMember = () => {
    console.log('Member = ', this.state);

    this.db.collection("member_master").add(this.state)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef);
        docRef.update({ uid: docRef.id });
        this.props.navigation.navigate('Home');
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputStyle}
          placeholder="Mobile"
          value={this.state.mobile}
          onChangeText={(val) => this.updateInputVal(val, 'mobile')}
        />
        <TextInput
          style={[styles.inputStyle, {marginBottom: 10}]}
          placeholder="Full Name"
          value={this.state.name}
          onChangeText={(val) => this.updateInputVal(val, 'name')}
        />
        <RadioButton.Group onValueChange={value => this.updateInputVal(value, 'gender')}
          value={this.state.gender}>
          <View style={styles.radio}>
            <Text style={styles.radioText}>Gender: </Text>
            <RadioButton.Item label="Male" value="male" color='blue' style={styles.radioBtn} labelStyle={styles.radioBtnLbl} />
            <RadioButton.Item label="Female" value="female"  color='blue' style={styles.radioBtn} labelStyle={styles.radioBtnLbl} />
          </View>
        </RadioButton.Group>
        <TextInput
          style={[styles.inputStyle, {marginBottom: 35}]}
          placeholder="City"
          value={this.state.city}
          onChangeText={(val) => this.updateInputVal(val, 'city')}
        />
        <Button
          color="#3740FE"
          title="Submit"
          onPress={() => this.addMember()}
        />
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
    padding: 35,
    backgroundColor: '#aac8dc'
  },
  inputStyle: {
    width: '100%',
    marginBottom: 25,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 2
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  radioText: {
    lineHeight: 30,
    fontSize: 16
  },
  radioBtn: {
    marginRight: 20,
  },
  radioBtnLbl: {
    fontSize: 14
  }
});