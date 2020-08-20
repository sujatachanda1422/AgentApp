import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Fontisto, Entypo } from '@expo/vector-icons';

export default class Settings extends Component {
  constructor() {
    super();
  }


  UNSAFE_componentWillMount() {
  }

  render() {
    return (
      <View>
        <TouchableOpacity style={styles.listItem}
          onPress={() => this.props.navigation.navigate('Register',
            { user: this.props.route.params.user })}>
          <Fontisto name="person" size={24} color="black" />
          <Text style={styles.listText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}
          onPress={() => this.props.navigation.navigate('AddMember',
            { uid: this.props.route.params.user.uid })}>
          <Entypo name="add-user" size={24} color="black" />
          <Text style={styles.listText}>Add member</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}
          onPress={() => this.props.navigation.navigate('Login')}>
          <Fontisto name="power" size={24} color="black" />
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