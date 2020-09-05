import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Register from './screens/register';
import Login from './screens/login';
import Home from './screens/home';
import Chat from './screens/chat';
import AddMember from './screens/addMember';
import MemberChatList from './screens/memberChatList';
import SubscriptionForm from './screens/subscriptionForm';
import AddSubscription from './screens/addSubscription';
import AddCity from './screens/city';
import SubscriptionPlans from './screens/subscriptionPlans';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

const Stack = createStackNavigator();

function getHeader(route, navigation) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'MemberList';

  switch (routeName) {
    case 'MemberList':
      return (
        <TouchableOpacity onPress={() => navigation.navigate('AddMember')}>
          <Entypo name="add-user" size={24} color="white" style={{ marginRight: 20 }} />
        </TouchableOpacity>
      )
    case 'Subscription':
      return (
        <TouchableOpacity onPress={() => navigation.navigate('AddSubscription',
          { verified: false }
        )}>
          <MaterialIcons name="group-add" size={34} color="white" style={{ marginRight: 20 }} />
        </TouchableOpacity>
      )
    case 'Settings':
      return null;
  }
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
        screenOptions={{
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: '#fff'
          },
          headerStyle: {
            backgroundColor: '#0c2c94',
          },
        }}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Register"
          options={{
            title: 'Sign Up'
          }}
          component={Register}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={({ route, navigation }) => ({
            headerRight: () => getHeader(route, navigation)
          })}
        />
        <Stack.Screen
          name="AddMember"
          options={{
            title: 'Add Member'
          }}
          component={AddMember}
        />
        <Stack.Screen
          name="MemberChatList"
          options={{
            title: 'Chat List'
          }}
          component={MemberChatList}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{
            headerTitleAlign: 'left',
          }}
        />
        <Stack.Screen
          name="SubscriptionForm"
          options={{
            title: 'Subscription Form'
          }}
          component={SubscriptionForm}
        />
        <Stack.Screen
          name="AddSubscription"
          options={{
            title: 'Add Subscription'
          }}
          component={AddSubscription}
        />
        <Stack.Screen
          name="AddCity"
          options={{
            title: 'City'
          }}
          component={AddCity}
        />
        <Stack.Screen
          name="SubscriptionPlans"
          options={{
            title: 'Subscription Plans'
          }}
          component={SubscriptionPlans}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    color: '#000',
    fontSize: 16,
    marginRight: 20,
    borderRadius: 2,
    fontWeight: 'bold',
    backgroundColor: '#ddd',
    paddingHorizontal: 8,
    paddingVertical: 5
  },
});
