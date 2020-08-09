import React, { Component } from 'react';
import Subscription from './subscription';
import MemberList from './memberList';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
let user: null = null;

export default class Home extends Component {
  constructor() {
    super();
  }


  UNSAFE_componentWillMount() {
    user = this.props.route.params.user;
    console.log('User = ', user);
  }

  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="MemberList" component={() => <MemberList user={user} {...this.props}></MemberList>} />
        <Tab.Screen name="Subscription" component={() => <Subscription user={user} {...this.props}></Subscription>} />
      </Tab.Navigator>
    );
  }
}
