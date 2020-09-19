import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import firebase from '../database/firebase';
import { RadioButton } from 'react-native-paper';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-community/picker';

let cityList: firebase.firestore.DocumentData[] = [];

export default class AddMember extends Component {
  db: firebase.firestore.Firestore;
  date: Date;

  constructor() {
    super();

    const dateNow = new Date();
    this.date = new Date(dateNow.getFullYear() - 18, dateNow.getMonth(), dateNow.getDate());

    this.state = {
      mobile: null,
      name: '',
      gender: 'female',
      city: 'Kolkata',
      image: null,
      dob: '',
      verify: false,
      setDob: this.date,
      isLoading: false,
      agentId: ''
    }

    this.db = firebase.firestore();
  }

  async getCityList() {
    cityList = [];

    await this.db.collection("city_list").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        cityList.push(doc.data());
      });
    });
  }

  UNSAFE_componentWillReceiveProps() {
    if (this.props.route.params.uid) {
      this.setState({ agentId: this.props.route.params.uid });
    }
  }

  async UNSAFE_componentWillMount() {
    this.setState({ isLoading: true });
    await this.getCityList();

    let details = await AsyncStorage.getItem('loggedInMemberDetails');

    if (details) {
      details = JSON.parse(details);
      this.setState({ agentId: details.uid });
    }

    this.setState({ isLoading: false });
  }

  updateInputVal = (val: any, prop: React.ReactText) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  setDob(date: Date | undefined) {
    if (!date) {
      return;
    }

    const dateNow = new Date(this.date).getTime();
    const selectedDate = new Date(date).getTime();

    if (selectedDate < dateNow) {
      this.setState({
        dob: new Date(date).toLocaleDateString('en-US'),
        showDatePicker: false
      });
    } else {
      Alert.alert('', 'Age needs to be 18 years+',
        [
          {
            text: 'OK',
            onPress: () => this.setState({
              dob: '',
              showDatePicker: false
            })
          }
        ]);
    }
  }

  async pickImage() {
    const options = {
      title: 'Select Profile Picture',
      noData: true,
      maxWidth: 500,
      maxHeight: 500,
      quality: 1,
      storageOptions: { privateDirectory: true }
    };

    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        try {
          this.setState({ isLoading: true });

          const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
              resolve(xhr.response);
            };
            xhr.onerror = function () {
              reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", response.uri, true);
            xhr.send(null);
          });

          const mimeString = response.uri
            .split(",")[0]
            .split(":")[1]
            .split(";")[0];

          const storageRef = firebase.storage().ref();
          const imageRef = storageRef.child(`images/${this.state.mobile}.jpg`);
          const snapshot = await imageRef.put(blob, { contentType: mimeString });

          const url = await snapshot.ref.getDownloadURL();
          this.setState({ image: url, isLoading: false });
        }
        catch (err) {
          console.log("Img err ..........", err);
        }
      }
    });
  }

  checkDuplicateMobile() {
    return this.db.collection("member_list")
      .doc(this.state.mobile).get().then(doc => {
        if (doc.exists && doc.data().mobile) {
          return doc.exists;
        }

        return false;
      });
  }

  addMember = async () => {
    if (!this.state.dob) {
      Alert.alert('', 'Please enter date of the birth');
      return;
    }

    const isDuplicate = await this.checkDuplicateMobile();

    if (isDuplicate) {
      Alert.alert('', 'Mobile number already exists, please use another');
      return;
    }

    this.db.collection("member_list")
      .doc(this.state.mobile)
      .set({
        mobile: this.state.mobile,
        name: this.state.name,
        gender: this.state.gender,
        city: this.state.city,
        image: this.state.image,
        dob: new Date(this.state.dob).getTime(),
        agentId: this.state.agentId
      })
      .then(_ => {
        this.props.navigation.navigate('Home', {
          screen: 'MemberList',
          params: { user: true }
        });
      })
      .catch(function (error: any) {
        console.error("Error adding document: ", error);
      });
  }

  checkForm() {
    if (!this.state.mobile || !this.state.name || !this.state.city) {
      Alert.alert('', 'Please enter all the details to proceed further');
      return;
    }

    if (!(/^\d{10}$/).test(this.state.mobile)) {
      Alert.alert('', 'Please provide a valid mobile number');
      return;
    }

    this.setState({ verify: true });
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
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} >
        <View style={styles.container}>
          {!this.state.verify &&
            <View>
              <TextInput
                style={styles.inputStyle}
                placeholder="Mobile"
                keyboardType='numeric'
                maxLength={10}
                value={this.state.mobile}
                onChangeText={(val) => this.updateInputVal(val, 'mobile')}
              />
              <TextInput
                style={[styles.inputStyle, { marginBottom: 10 }]}
                placeholder="Full Name"
                value={this.state.name}
                onChangeText={(val) => this.updateInputVal(val, 'name')}
              />
              <RadioButton.Group onValueChange={value => this.updateInputVal(value, 'gender')}
                value={this.state.gender}>
                <View style={styles.radio}>
                  <Text style={styles.radioText}>Gender: </Text>
                  <RadioButton.Item label="Male" value="male" color='blue' style={styles.radioBtn} labelStyle={styles.radioBtnLbl} />
                  <RadioButton.Item label="Female" value="female" color='blue' style={styles.radioBtn} labelStyle={styles.radioBtnLbl} />
                </View>
              </RadioButton.Group>

              <Picker
                selectedValue={this.state.city}
                style={styles.dropDown}
                onValueChange={(itemValue) => this.setState({ city: itemValue })}
              >
                {cityList.map(item => {
                  return <Picker.Item key={item.name} label={item.name} value={item.name} />
                })
                }
              </Picker>

              <Button
                color="#3740FE"
                title="Verify Details"
                onPress={() => this.checkForm()}
              />
            </View>
          }

          {this.state.verify &&
            <View>
              <TouchableOpacity
                style={styles.inputStyle}
                onPress={() => this.setState({ showDatePicker: true })}
              >
                <Text>{this.state.dob ? this.state.dob : 'Date of Birth'}</Text>
              </TouchableOpacity>
              {this.state.showDatePicker &&
                <RNDateTimePicker
                  value={this.state.setDob}
                  onChange={(evt, date) => this.setDob(date)}
                />
              }

              <View style={{ marginBottom: 20 }}>
                <Button title="Pick an image from camera roll" onPress={() => this.pickImage()} />
                {this.state.image &&
                  <Image source={{ uri: this.state.image }}
                    style={{ marginTop: 20, width: 200, height: 200 }} />
                }
              </View>
              <Button
                color="#3740FE"
                title="Add Member"
                onPress={() => this.addMember()}
              />

              <Text
                style={{ marginTop: 30, color: 'blue', fontSize: 20, textAlign: 'center' }}
                onPress={() => this.setState({ verify: false })}
              > Go Back</Text>
            </View>
          }
        </View>
      </KeyboardAwareScrollView >
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
  dropDown: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff'
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