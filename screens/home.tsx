import React, { Component } from 'react';
import Subscription from './subscription';
import MemberList from './memberList';
import Settings from './settings';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, AntDesign } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
let user: null = null;

export default class Home extends Component {
  constructor() {
    super();
  }


  UNSAFE_componentWillMount() {
    user = this.props.route.params.user;
  }

  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          options={{
            tabBarLabel: 'Member List',
            tabBarIcon: () => (
              <Entypo name="list" size={24} color="black" />
            )
          }}
          name="MemberList" component={() => <MemberList user={user} {...this.props}></MemberList>} />
        <Tab.Screen
          options={{
            tabBarIcon: () => (
              <AntDesign name="codesquareo" size={24} color="black" />
            )
          }}
          name="Subscription" component={() => <Subscription user={user} {...this.props}></Subscription>} />
        <Tab.Screen
          options={{
            tabBarIcon: () => (
              <AntDesign name="setting" size={24} color="black" />
            )
          }}
          name="Settings" component={() => <Settings user={user} {...this.props}></Settings>} />
      </Tab.Navigator>
    );
  }
}
