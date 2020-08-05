import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import firebase from '../database/firebase';
import { AntDesign } from '@expo/vector-icons';

export default class MemberChatList extends Component {
  memberArray: Array<Object> = [];

  constructor() {
    super();
    this.state = {
      memberList: []
    }
  }

  UNSAFE_componentWillMount() {
    const memberMobile = this.props.route.params.mobile;

    firebase
      .firestore()
      .collection("chat_list")
      .doc(memberMobile)
      .collection('members')
      .get().then((querySnapshot) => {
        // console.log('Query - ', querySnapshot);

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
          keyExtractor={(index) => index.mobile}
          renderItem={({ item }) =>
            <TouchableOpacity style={styles.item}
              onPress={() => this.props.navigation.navigate('Chat',
                {
                  from: this.props.route.params.mobile,
                  to: item.mobile,
                  name: item.name
                })} >
              <View style={styles.listItem}>
                <Text style={styles.listText}>
                  {item.name}
                </Text>
                <Text style={styles.listText}>City: {item.city}</Text>
              </View>
              <View>
                <AntDesign name="right" size={24} color="black" />
              </View>
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
    backgroundColor: '#aac8dc'
  },
  item: {
    paddingHorizontal: 10,
    borderColor: '#868181',
    borderWidth: 1,
    marginLeft: 10,
    marginTop: 10,
    marginRight: 10,
    borderRadius: 4,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  listItem: {
    flex: 1,
    marginBottom: 6
  },
  listText: {
    textTransform: 'capitalize',
    lineHeight: 30
  }
});