import React, {Component} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  StyleSheet
} from 'react-native';
import firebase from 'firebase';

export default class Chat extends Component {
  static navigationOptions = ({route}) => ({
    title: route.params.name,
  });

  constructor(props) {
    super(props);
    this.state = {
      person: {
        name: 'Sujata',
        phone: '9062103433',
      },
      textMessage: '',
      messageList: [],
    };
  }

  UNSAFE_componentWillMount() {
    firebase
      .database()
      .ref('messages')
      .child('8062103433')
      .child(this.state.person.phone)
      .on('child_added', value => {
        console.log("Old chats == ", value.val());
        this.setState(prevState => {
          return {
            messageList: [...prevState.messageList, value.val()],
          };
        });
      });
  }

  handleChange = key => val => {
    this.setState({[key]: val});
  };

  convertTime = time => {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    if (c.getDay() !== d.getDay()) {
      result = d.getDay() + ' ' + d.getMonth() + ' ' + result;
    }
    return result;
  };

  sendMessage = async () => {
    if (this.state.textMessage.length > 0) {
      let msgId = firebase
        .database()
        .ref('messages')
        .child('8062103433')
        .child(this.state.person.phone)
        .push().key;
      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: '8062103433',
      };
      updates[
        'messages/' + '8062103433' + '/' + this.state.person.phone + '/' + msgId
      ] = message;
      updates[
        'messages/' + this.state.person.phone + '/' + '8062103433' + '/' + msgId
      ] = message;
      firebase
        .database()
        .ref()
        .update(updates);
      this.setState({textMessage: ''});
    }
  };

  renderRow = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: '70%',
          alignSelf: item.from === '8062103433' ? 'flex-end' : 'flex-start',
          backgroundColor: item.from === '8062103433' ? '#00A398' : '#7cb342',
          borderRadius: 10,
          marginBottom: 10,
        }}>
        <Text style={{color: '#fff', padding: 7, fontSize: 16}}>
          {item.message}
        </Text>
        <Text style={{color: '#eee', padding: 3, fontSize: 12}}>
          {this.convertTime(item.time)}
        </Text>
      </View>
    );
  };

  render() {
    let {height, width} = Dimensions.get('window');
    return (
      <SafeAreaView>
        <FlatList
          style={{padding: 10, height: height * 0.8}}
          data={this.state.messageList}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 5,
          }}>
          <TextInput
            style={styles.input}
            value={this.state.textMessage}
            placeholder="type message here..."
            onChangeText={this.handleChange('textMessage')}
          />
          <TouchableOpacity
            onPress={this.sendMessage}
            style={{paddingBottom: 10, marginLeft: 5}}>
            <Image
              source={require('../images/send-button.png')}
              style={{width: 32, height: 32, marginRight: 5, marginLeft: 5}}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    input: {
        padding: 10,
        borderWidth: 2,
        borderColor: '#cccc',
        width: '80%',
        marginBottom: 10,
        borderRadius: 5,
        color: '#000000',
      }
  });
