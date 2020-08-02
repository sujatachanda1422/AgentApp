import React from 'react';
import { StyleSheet, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Register from './screens/register';
import Login from './screens/login';
import Home from './screens/home';
import Chat from './screens/chat';
import AddMember from './screens/addMember';
import MemberChatList from './screens/memberChatList';

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
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
            options={{
              headerTitleStyle: {
                textAlign: "center"
              }
            }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={({ navigation, route }) => ({
              title: 'Member List',
              headerRight: () => (
                <Button
                  onPress={() => navigation.navigate('AddMember')}
                  title="ADD" color="#000"
                />
              )
            })}
          />
          <Stack.Screen
            name="AddMember"
            component={AddMember}
          />
          <Stack.Screen
            name="MemberChatList"
            component={MemberChatList}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
