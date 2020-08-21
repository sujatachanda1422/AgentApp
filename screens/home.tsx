import React, { Component } from 'react';
import Subscription from './subscription';
import MemberList from './memberList';
import Settings from './settings';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { View, ActivityIndicator } from 'react-native';

const Tab = createBottomTabNavigator();

export default class Home extends Component {
  constructor() {
    super();

    this.state = {
      user: false
    };
  }

  async UNSAFE_componentWillReceiveProps() {
    if (!this.state.user) {
      let details = await AsyncStorage.getItem('loggedInMemberDetails');

      details = JSON.parse(details);
      this.setState({ user: details });

      this.props.navigation.setOptions({
        title: 'Hi, ' + details.name
      });

      return;
    }

    if (this.props.route.params && this.props.route.params.screen === 'Settings') {
      this.props.navigation.setOptions({
        title: 'Hi, ' + this.props.route.params.params.name
      });
      const details = await AsyncStorage.getItem('loggedInMemberDetails');
      this.setState({ user: details });
    }

    if (this.props.route.params && this.props.route.params.screen === 'MemberList') {
      this.setState({ user: this.props.route.params.params.user });
    }
  }

  async UNSAFE_componentWillMount() {
    let details = await AsyncStorage.getItem('loggedInMemberDetails');

    if (details) {
      details = JSON.parse(details);
      this.setState({ user: details });

      this.props.navigation.setOptions({
        title: 'Hi, ' + details.name
      });
    } else {
      this.props.navigation.navigate('Login');
    }
  }

  getMemberList = () => {
    return <MemberList user={this.state.user} {...this.props}></MemberList>;
  }

  getSubscription = () => {
    return <Subscription user={this.state.user} {...this.props}></Subscription>;
  }

  getSettings = () => {
    return <Settings user={this.state.user} {...this.props}></Settings>;
  }

  render() {
    if (this.state.user) {
      return (
        <Tab.Navigator>
          <Tab.Screen
            options={{
              tabBarLabel: 'Member List',
              tabBarIcon: () => (
                <Entypo name="list" size={24} color="black" />
              )
            }}
            name="MemberList" component={this.getMemberList} />
          <Tab.Screen
            options={{
              tabBarIcon: () => (
                <AntDesign name="codesquareo" size={24} color="black" />
              )
            }}
            name="Subscription" component={this.getSubscription} />
          <Tab.Screen
            options={{
              tabBarIcon: () => (
                <AntDesign name="setting" size={24} color="black" />
              )
            }}
            name="Settings" component={this.getSettings} />
        </Tab.Navigator>
      );
    }

    return (
      <View style={{
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
      }}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    )
  }
}
