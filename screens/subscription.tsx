import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import firebase from '../database/firebase';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

export default class Subscription extends Component {
  subscriptionArray: Array<Object> = [];

  constructor() {
    super();

    this.state = {
      isLoading: false,
      subscriptionList: []
    }
  }

  UNSAFE_componentWillMount() {
    this.getList();

    this.props.navigation.setOptions({
      headerLeft: () => {
        return (
          <TouchableOpacity
            onPress={() => this.getList()}>
           <MaterialCommunityIcons name="reload" size={24} color="white"  style={{ marginLeft: 20 }}  />
          </TouchableOpacity>
        );
      }
    });
  }

  UNSAFE_componentWillReceiveProps() {
    this.getList();
  }

  getList() {
    this.setState({
      isLoading: true
    });

    this.subscriptionArray = [];

    const db = firebase
      .firestore()
      .collection("subscription_list");

    db
      .get()
      .then((querySnapshot) => {
        let data;

        if (!querySnapshot.size) {
          this.setState({
            isLoading: false,
            subscriptionList: [...this.subscriptionArray]
          });
          return;
        }
        querySnapshot.forEach(doc => {
          db.doc(doc.id).collection('list').get().then(snapshot => {
            snapshot.forEach((item) => {
              data = item.data();

              if (data.status === 'pending') {
                this.subscriptionArray.push(data);
              }
            });

            this.setState({
              isLoading: false,
              subscriptionList: [...this.subscriptionArray]
            });
          });
        });
      })
      .catch(err => {
        console.log('Error on subscription list fetch', this.state, err);
        this.setState({
          isLoading: false
        });
      });
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
      <View style={styles.container}>
        {this.state.subscriptionList.length > 0 &&
          < FlatList
            data={this.state.subscriptionList}
            width='100%'
            keyExtractor={(index) => index.id}
            renderItem={({ item }) =>
              <TouchableOpacity style={styles.item}
                onPress={() => this.props.navigation.navigate('SubscriptionForm',
                  {
                    subscriber: item,
                    user: this.props.user
                  })} >
                <View style={styles.listItem}>
                  <Text style={[styles.listText, { fontSize: 20, color: 'blue' }]}>
                    {item.member_mobile}
                  </Text>
                  <Text style={styles.listText}>Package: {item.package_name}</Text>
                </View>
                <View>
                  <AntDesign name="right" size={24} color="black" />
                </View>
              </TouchableOpacity>}
          />
        }

        {!this.state.subscriptionList.length &&
          <Text style={styles.noList}>No subscription found.</Text>
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
    marginBottom: 6,
    paddingVertical: 5
  },
  listText: {
    textTransform: 'capitalize',
    lineHeight: 30,
    color: '#000'
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
  },
  noList: {
    fontSize: 18,
    padding: 20
  }
});
