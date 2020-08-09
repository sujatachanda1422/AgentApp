import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Register from './screens/register';
import Login from './screens/login';
import Home from './screens/home';
import Chat from './screens/chat';
import AddMember from './screens/addMember';
import MemberChatList from './screens/memberChatList';
import SubscriptionForm from './screens/subscriptionForm';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login"
        screenOptions={{
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
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={({ navigation, route }) => ({
            title: 'Home',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('AddMember',
                {
                  uid: route.params.user.uid
                })}>
                <Text style={styles.addBtn}>
                  ADD
                </Text>
              </TouchableOpacity>
            )
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
        />
        <Stack.Screen
          name="SubscriptionForm"
          options={{
            title: 'Subscription Form'
          }}
          component={SubscriptionForm}
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
