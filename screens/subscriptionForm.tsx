import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import firebase from '../database/firebase';
import { Picker } from '@react-native-community/picker';
import { CommonActions } from '@react-navigation/native';

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
    this.setState({
      package: this.props.route.params.subscriber.package_name,
      mobile: this.props.route.params.subscriber.member_mobile,
      name: this.props.route.params.subscriber.name
    });

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

  acceptSubscription = () => {
    const selectedPackage = this.state.packages.filter(pkg => pkg.name === this.state.package)[0];
    const validity = selectedPackage.validity | 1;
    const remainingChat = selectedPackage.chatNumber;

    const newDoc = {
      accepted_by: this.props.route.params.user.email,
      status: 'accepted',
      package_name: this.state.package,
      request_date_time: new Date().toLocaleDateString("en-US"),
      expiry_date: validity * 30,
      remaining_chat: remainingChat
    };

    // console.log('State = ', newDoc, this.state, this.props);

    this.db.collection("subscription_list").doc(this.state.mobile)
      .update(newDoc)
      .then(_ => {
        alert('Thank you for accepting the request');

        Alert.alert('', 'Thank you for accepting the request',
          [
            {
              text: 'OK',
              onPress: () => this.props.navigation.dispatch(CommonActions.goBack())
            }
          ]);

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
            editable={false}
            value={this.state.mobile}
            onChangeText={(val) => this.updateInputVal(val, 'mobile')}
          />
          <TextInput
            style={styles.inputStyle}
            placeholder="Name"
            editable={false}
            value={this.state.name}
            onChangeText={(val) => this.updateInputVal(val, 'name')}
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
            onPress={() => this.acceptSubscription()}
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
    backgroundColor: '#bfbebe',
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