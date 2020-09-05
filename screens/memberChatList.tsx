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
let unreadMsgObj = {};

export default class MemberChatList extends Component {
  memberArray: Array<Object> = [];
  private _unsubscribe: any;

  constructor() {
    super();
    this.state = {
      memberList: []
    }
  }

  getAge(dob: number) {
    return Math.floor((new Date() - dob) / 3.15576e+10);
  }

  UNSAFE_componentWillMount() {
    let docData;
    const { name, mobile, city, dob } = this.props.route.params.user;

    this.props.navigation.setOptions({
      headerTitle: () => {
        return (
          <View>
            <Text style={{ fontSize: 22, color: '#fff' }}>{name}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ color: '#fff' }}>{city}</Text>
              {(dob != null && typeof (dob) !== 'string') &&
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
          docData = doc.data();
          docData.count = 0;
          this.memberArray.push(docData);
        });

        this.setState({ memberList: [...this.memberArray] });
      });

    this.attachUnreadCountEvent(mobile);

    this._unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.sortUnread();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
    
    firebase
      .database()
      .ref('recents')
      .child(this.props.route.params.user.mobile)
      .off('value');
  }

  attachUnreadCountEvent(user: string) {
    firebase
      .database()
      .ref('recents')
      .child(user)
      .on('value', (value) => {
        unreadMsgObj = {};
        const val = value.val();

        for (let i in val) {
          if (val[i].unread) {
            if (unreadMsgObj[i]) {
              unreadMsgObj[i]['count'] = val[i].unread.length;
            } else {
              unreadMsgObj[i] = {
                count: val[i].unread.length
              }
            }
          }

          if (val[i].time) {
            if (unreadMsgObj[i]) {
              unreadMsgObj[i]['time'] = val[i].time;
            } else {
              unreadMsgObj[i] = {
                time: val[i].time
              }
            }
          }
        }

        this.sortUnread();
        this.showUnreadCount();
      });
  }


  sortUnread() {
    if (!Object.keys(unreadMsgObj).length) return;

    this.state.memberList.sort((member1, member2) => {
      if (unreadMsgObj[member1.mobile] && unreadMsgObj[member2.mobile]) {
        return unreadMsgObj[member2.mobile].time - unreadMsgObj[member1.mobile].time;
      }
      if (unreadMsgObj[member1.mobile]) {
        return -1;
      }
      if (unreadMsgObj[member2.mobile]) {
        return 1;
      }

      return null;
    });
  }

  showUnreadCount() {
    let mobile;
    let memberListArr = [...this.state.memberList];

    for (let i = 0; i < memberListArr.length; i++) {
      mobile = memberListArr[i].mobile;
      if (unreadMsgObj[mobile]) {
        memberListArr[i].count = unreadMsgObj[mobile].count;
      } else {
        memberListArr[i].count = 0;
      }
    }

    this.setState({ memberList: memberListArr });
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
                    {(item.dob != null && typeof (item.dob) !== 'string') &&
                      <View style={{ flexDirection: 'row' }}>
                        <Text>,</Text>
                        <Text style={{ color: '#000', paddingHorizontal: 5 }}>
                          Age - {this.getAge(item.dob)}
                        </Text>
                      </View>
                    }
                  </View>
                </View>
                {item.count > 0 &&
                  <View>
                    <Text style={styles.unreadCount} >{item.count}</Text>
                  </View>
                }
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
  },
  unreadCount: {
    backgroundColor: '#de5656',
    borderRadius: 24,
    width: 24,
    height: 24,
    lineHeight: 24,
    fontSize: 12,
    textAlign: 'center',
    color: '#fff'
  }
});