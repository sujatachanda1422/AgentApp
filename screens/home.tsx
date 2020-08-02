import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import firebase from '../database/firebase';

export default class Home extends Component {
  memberArray: Array<Object> = [];

  constructor() {
    super();
    this.state = {
      memberList: []
    }
  }

  signOut = () => {
    // firebase.auth().signOut().then(() => {
    this.props.navigation.navigate('Login')
    // })
    // .catch(error => this.setState({ errorMessage: error.message }))
  }

  UNSAFE_componentWillMount() {
    firebase
      .firestore()
      .collection("member_master").get().then((querySnapshot) => {
        console.log('Query - ', querySnapshot);

        querySnapshot.forEach((doc) => {
          this.memberArray.push(doc.data());
        });

        this.setState({ memberList: [...this.memberArray] });

        console.log('Data = ', this.memberArray);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.memberList}
          width='100%'
          keyExtractor={(index) => index.uid}
          renderItem={({ item }) =>
            <TouchableOpacity style={styles.item}
              onPress={() => this.props.navigation.navigate('MemberChatList', { uid: item.uid })} >
              <Text style={styles.listText}>
                {item.name}
              </Text>
              <Text>City: {item.city}</Text>
            </TouchableOpacity>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    backgroundColor: '#fff'
  },
  item: {
    padding: 10,
    width: '100%',
    borderBottomColor: '#000',
    borderBottomWidth: 1
  },
  listText: {
    lineHeight: 30
  }
});