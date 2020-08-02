import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, Button } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Register from './screens/register';
import Login from './screens/login';
import Home from './screens/home';
import Chat from './screens/chat';
import AddMember from './screens/addMember';
import MemberChatList from './screens/memberChatList';
import { Provider as PaperProvider } from 'react-native-paper';
const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
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
              title: 'Member List',
              headerRight: () => (
                <Button
                  onPress={() => navigation.navigate('AddMember')}
                  title="ADD"
                  color="#000"
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
    </PaperProvider>
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
