import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image
} from 'react-native';
import firebase from '../database/firebase';
import { AntDesign } from '@expo/vector-icons';
const userImg = require("../images/user.jpg");

export default class MemberChatList extends Component {
  memberArray: Array<Object> = [];

  constructor() {
    super();
    this.state = {
      memberList: []
    }
  }

  getAge(dob: string | number | Date) {
    return Math.floor((new Date() - new Date(dob).getTime()) / 3.15576e+10);
  }

  UNSAFE_componentWillMount() {
    const { name, mobile, city, dob } = this.props.route.params.user;

    this.props.navigation.setOptions({
      headerTitle: () => {
        return (
          <View>
            <Text style={{ fontSize: 22, color: '#fff' }}>{name}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ color: '#fff' }}>{city}</Text>
              {(dob !== '' && dob != null) &&
                <Text style={{ color: '#fff' }}>, {this.getAge(dob)}</Text>
              }
            </View>
          </View>
        )
      }
    });

    firebase
      .firestore()
      .collection("chat_list")
      .doc(mobile)
      .collection('members')
      .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.memberArray.push(doc.data());
        });

        this.setState({ memberList: [...this.memberArray] });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.memberList.length > 0 &&
          <FlatList
            data={this.state.memberList}
            width='100%'
            keyExtractor={(index) => index.mobile}
            renderItem={({ item }) =>
              <TouchableOpacity style={styles.item}
                onPress={() => this.props.navigation.navigate('Chat',
                  {
                    from: this.props.route.params.user.mobile,
                    to: item.mobile,
                    user: item
                  })} >
                <Image source={(item.image && item.image !== '') ?
                  { uri: item.image } : userImg} style={styles.profileImg} />
                <View style={styles.listItem}>
                  <Text style={styles.listText}>
                    {item.name}
                  </Text>
                  <View style={styles.listDesc}>
                    <Text style={{ color: '#000', textTransform: 'capitalize' }}>City - {item.city}</Text>
                    {(item.dob != null && item.dob !== '') &&
                      <View style={{ flexDirection: 'row' }}>
                        <Text>,</Text>
                        <Text style={{ color: '#000', paddingHorizontal: 5 }}>
                          Age - {this.getAge(item.dob)}
                        </Text>
                      </View>
                    }
                  </View>
                </View>
                <View>
                  <AntDesign name="right" size={24} color="#dcdcdc" />
                </View>
              </TouchableOpacity>}
          />
        }
        {this.state.memberList.length === 0 &&
          <Text style={{ textAlign: 'center', fontSize: 20, margin: 20 }}>
            No member found</Text>
        }
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
    paddingVertical: 8,
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
  listText: {
    fontSize: 20,
    color: 'green',
    marginBottom: 3
  },
  listItem: {
    flex: 1,
    marginBottom: 6
  },
  listDesc: {
    flexDirection: 'row',
    paddingVertical: 5
  },
  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 10
  }
});