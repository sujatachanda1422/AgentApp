import React, { Component } from 'react';
import Subscription from './subscription';
import MemberList from './memberList';
import Settings from './settings';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';
import { Entypo, AntDesign } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
let user: null = null;

export default class Home extends Component {
  constructor() {
    super();
  }


  UNSAFE_componentWillMount() {
    user = this.props.route.params.user;

    this.props.navigation.setOptions({
      headerLeft: null,
      title: 'Hi, ' + user.name,
      headerRight: () => (
        <TouchableOpacity onPress={() => this.props.navigation.navigate('AddMember',
          { uid: user.uid }
        )}>
          <Entypo name="add-user" size={24} color="white" style={{ marginRight: 20 }} />
        </TouchableOpacity>
      )
    });
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
