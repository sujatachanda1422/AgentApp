import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';
import firebase from '../database/firebase';
import { Picker } from '@react-native-community/picker';

export default class SubscriptionForm extends Component {
  db: firebase.firestore.Firestore;

  constructor() {
    super();
    this.state = {
      mobile: '',
      name: '',
      package: '',
      packages: []
    };

    this.db = firebase.firestore();
  }

  UNSAFE_componentWillMount() {
    this.db.collection("package_list").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let docData: firebase.firestore.DocumentData;
        docData = doc.data();

        this.setState(prevState => {
          return {
            packages: [...prevState.packages, docData],
          };
        });
      });

      this.setState({ package: this.props.route.params.user.package_name });

      console.log('State = ', this.state);
    })
      .catch(err => {
        console.error('Error in package fetch', err);
      })
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  registerUser = () => {
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
          password: ''
        });
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.overlay}>
          <TextInput
            style={styles.inputStyle}
            placeholder="Mobile"
            value={this.props.route.params.user.member_mobile}
            onChangeText={(val) => this.updateInputVal(val, 'name')}
          />
          <TextInput
            style={styles.inputStyle}
            placeholder="Name"
            value={this.props.route.params.user.member_mobile}
            onChangeText={(val) => this.updateInputVal(val, 'email')}
          />
          <Picker
            selectedValue={this.state.package}
            style={{ height: 50, width: '100%', marginBottom: 20 }}
            onValueChange={(itemValue) => this.setState({ package: itemValue })}
          >
            {this.state.packages.map(item => {
              return <Picker.Item key={item.id} label={item.name} value={item.name} />
            })
            }
          </Picker>

          <Button
            color="#3740FE"
            title="Submit"
            onPress={() => this.registerUser()}
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