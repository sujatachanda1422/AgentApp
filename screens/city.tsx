import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal
} from 'react-native';
import firebase from '../database/firebase';
import { Entypo } from '@expo/vector-icons';
import { TextInput, Button } from 'react-native-paper';

export default class AddCity extends Component {
  db: firebase.firestore.Firestore;
  cityArray: [];

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      name: '',
      id: null,
      cityList: [],
      modalVisible: false,
      isLoading: false,
      isUpdate: false
    };

    this.db = firebase.firestore();
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  UNSAFE_componentWillMount() {
    this.getCityList();

    this.props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            onPress={() => this.openCityModal()}>
            <Entypo name="add-to-list" size={32} color="white" style={{ marginRight: 20 }} />
          </TouchableOpacity>
        );
      }
    });
  }


  capitalizeCity(string: string) {
    return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
  }

  getCityList() {
    this.setState({ isLoading: true });

    this.db.collection('city_list')
      .orderBy('name')
      .get()
      .then(querySnapshot => {
        this.cityArray = [];

        querySnapshot.forEach((doc) => {
          this.cityArray.push(doc.data());
        });

        this.setState({ cityList: [...this.cityArray], isLoading: false });
      })
      .catch((error) => {
        this.setState({ isLoading: false });

        console.log("Subscription list rrror: ", error);
      });
  }

  updateCity(isUpdate: boolean) {
    const city = this.state.name.trim().toLowerCase();

    if (!city) {
      Alert.alert('', 'Please enter a valid name');
      return;
    }

    Alert.alert('', 'Are you sure you want to proceed?',
      [
        {
          text: 'Cancel'
        },
        {
          text: 'Yes',
          onPress: () => this.updateCityInDB(isUpdate, city)
        }
      ]);
  }


  updateCityInDB(isUpdate: boolean, city: string) {
    const db = this.db.collection("city_list");

    db
      .where('name', '==', this.capitalizeCity(city))
      .get()
      .then(doc => {
        if (doc.size) {
          Alert.alert('', 'This city already exists. Please try another.');
          return;
        }

        if (isUpdate) {
          db.doc(this.state.id).update({
            name: this.capitalizeCity(city),
            id: this.state.id
          });
        } else {
          db.add({
            name: this.capitalizeCity(city)
          }).then(updatedDoc => {
            db.doc(updatedDoc.id).update({ id: updatedDoc.id });
          });
        }
        setTimeout(_ => {
          this.setState({ modalVisible: false });
          this.getCityList();
        }, 100);
      })
      .catch(function (error) {
        console.log("Error adding document: ", error);
      });
  }

  openCityModal(item?: { name: any; id: any; } | undefined) {
    this.setState({
      modalVisible: true,
      name: item ? item.name : '',
      id: item ? item.id : null,
      isUpdate: !!item
    });
  }

  hideModal(type: string) {
    switch (type) {
      case 'edit':
      case 'add': this.updateCity(type === 'edit');
        break;
      case 'delete': this.deleteCity();
        break;
      case 'close': this.setState({ modalVisible: false });
        break;
    }
  }

  deleteCityFromDb() {
    this.db.collection("city_list").doc(this.state.id)
      .delete()
      .then(_ => {
        setTimeout(_ => {
          this.setState({ modalVisible: false });
          this.getCityList();
        }, 100);
      })
      .catch(function (error) {
        console.log("City delete error: ", error);
      });
  }

  deleteCity() {
    Alert.alert('', 'Are you sure you want to delete this city?',
      [
        {
          text: 'Cancel'
        },
        {
          text: 'Yes',
          onPress: () => this.deleteCityFromDb()
        }
      ]);
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      )
    }

    const { modalVisible } = this.state;

    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.cityList}
          contentContainerStyle={{ paddingVertical: 10 }}
          width='100%'
          keyExtractor={(index) => index.name}
          renderItem={({ item }) =>
            <TouchableOpacity style={styles.item}
              onPress={() => this.openCityModal(item)} >
              <View style={styles.listItem}>
                <Text style={[styles.listText, { fontSize: 20, color: 'blue' }]}>
                  {item.name}
                </Text>
              </View>
              <View>
                <Entypo name="edit" size={24} color="black" />
              </View>
            </TouchableOpacity>
          }
        />

        {modalVisible &&
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
            >
              <View
                style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity style={styles.clearBtn}
                    onPress={() => this.hideModal('close')}>
                    <Entypo name="cross" size={32} color="black" />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.inputStyle}
                    label="City"
                    value={this.state.name}
                    onChangeText={(val) => this.updateInputVal(val, 'name')}
                  />

                  <View style={{ flexDirection: 'row' }}>
                    {this.state.isUpdate &&
                      <Button color='#880101' mode="contained"
                        onPress={() => this.hideModal('delete')}
                        style={{ marginRight: 20 }} >
                        Delete
                      </Button>

                    }
                    <Button mode="contained"
                      color="#3740FE"
                      onPress={() =>
                        this.hideModal(this.state.isUpdate ? 'edit' : 'add')}
                    >
                      {this.state.isUpdate ? 'Update' : 'Add'}
                    </Button>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: '#aac8dc',
  },
  inputStyle: {
    width: '90%',
    marginVertical: 35,
    backgroundColor: '#fff',
    color: '#000'
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: '#868181',
    borderWidth: 1,
    marginTop: 10,
    marginHorizontal: 10,
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
    lineHeight: 30,
    color: '#000',
    fontSize: 17
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffffc9'
  },
  modalView: {
    margin: 20,
    width: '90%',
    backgroundColor: "white",
    position: 'relative',
    borderRadius: 10,
    padding: 10,
    paddingBottom: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  clearBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1
  },
});