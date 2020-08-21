import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import firebase from '../database/firebase';
const userImg = require("../images/user.jpg");
import { AntDesign } from '@expo/vector-icons';

export default class MemberList extends Component {
  memberArray: Array<Object> = [];

  constructor() {
    super();

    this.state = {
      memberList: []
    }
  }

  UNSAFE_componentWillReceiveProps() {
    this.getMemberList();
  }

  UNSAFE_componentWillMount() {
    this.getMemberList();
  }

  getAge(dob: string | number | Date) {
    return Math.floor((new Date() - new Date(dob).getTime()) / 3.15576e+10);
  }

  getMemberList() {
    firebase
      .firestore()
      .collection("member_list")
      .where('agentId', '==', this.props.user.uid)
      .get().then((querySnapshot) => {
        this.memberArray = [];

        querySnapshot.forEach((doc) => {
          this.memberArray.push(doc.data());
        });

        this.setState({ memberList: [...this.memberArray] });

        // console.log('Data = ', this.memberArray);
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
              onPress={() => this.props.navigation.navigate('MemberChatList', { user: item })} >
              <View>
                <Image source={(item.image && item.image !== '') ?
                  { uri: item.image } : userImg} style={styles.profileImg} />
              </View>
              <View style={styles.listItem}>
                <Text style={[styles.listText, { fontSize: 20, color: 'blue' }]}>
                  {item.name}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.listText}>City - {item.city}</Text>
                  {item.dob != null &&
                    <Text style={styles.listText}>
                      , Age - {this.getAge(item.dob)}
                    </Text>
                  }
                </View>
              </View>
              <View>
                <AntDesign name="right" size={24} color="black" />
              </View>
            </TouchableOpacity>
          }
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
    paddingVertical: 10,
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
    lineHeight: 30,
    color: '#000'
  },
  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 10
  }
});
