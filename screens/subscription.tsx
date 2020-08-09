import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import firebase from '../database/firebase';
import { AntDesign } from '@expo/vector-icons';

export default class Subscription extends Component {
  subscriptionArray: Array<Object> = [];

  constructor() {
    super();

    this.state = {
      subscriptionList: []
    }
  }

  UNSAFE_componentWillMount() {
    firebase
      .firestore()
      .collection("subscription_list")
      .get()
      .then((querySnapshot) => {
        let data;
        querySnapshot.forEach((doc) => {
          data = doc.data();

          if (data.status === 'pending') {
            this.subscriptionArray.push(data);
          }
        });

        this.setState({ subscriptionList: [...this.subscriptionArray] });

        console.log('Data = ', this.subscriptionArray);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.subscriptionList}
          width='100%'
          keyExtractor={(index) => index.member_mobile}
          renderItem={({ item }) =>
            <TouchableOpacity style={styles.item}
              onPress={() => this.props.navigation.navigate('SubscriptionForm', { user: item })} >
              <View style={styles.listItem}>
                <Text style={styles.listText}>
                  {item.member_mobile}
                </Text>
                <Text style={styles.listText}>Package: {item.package_name}</Text>
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
