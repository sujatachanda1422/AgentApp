import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Fontisto, Entypo, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

export default class Settings extends Component {
  constructor() {
    super();
  }


  UNSAFE_componentWillMount() {
  }

  logOut() {
    AsyncStorage.removeItem('loggedInMemberDetails');
    this.props.navigation.navigate('Login');
  }

  render() {
    return (
      <View>
        <TouchableOpacity style={styles.listItem}
          onPress={() => this.props.navigation.navigate('Register',
            { user: this.props.user })}>
          <Fontisto name="person" size={24} color="black" style={{ marginRight: 10 }} />
          <Text style={styles.listText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}
          onPress={() => this.props.navigation.navigate('AddMember',
            { uid: this.props.user.uid })}>
          <Entypo name="add-user" size={24} color="black" style={{ marginRight: 5 }} />
          <Text style={styles.listText}>Add Member</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.listItem, {marginLeft: -5}]}
          onPress={() => this.props.navigation.navigate('AddSubscription',
            { verified: false })}>
          <MaterialIcons name="group-add" size={34} color="black"/>
          <Text style={styles.listText}>Add Subscription</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}
          onPress={() => this.logOut()}>
          <Fontisto name="power" size={24} color="black" style={{ marginHorizontal: 5 }} />
          <Text style={styles.listText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#dcdcdc',
    flexDirection: 'row',
    backgroundColor: '#a4cef6'
  },
  listText: {
    fontSize: 22,
    color: '#000',
    paddingLeft: 15
  }
});