import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import firebase from '../database/firebase';

export default class PlanModal extends Component {
  db: firebase.firestore.Firestore;

  constructor(props: Readonly<{}>) {
    super(props);

    this.state = {
      modalVisible: true,
      name: '',
      price: '',
      chatNumber: '',
      validity: '',
      id: null
    };

    this.db = firebase.firestore();
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  UNSAFE_componentWillMount() {
    this.setState({ ...this.props.plan, modalVisible: true });
  }

  deletePlanFromDb() {
    this.db.collection("package_list").doc(this.state.id)
      .delete()
      .then(_ => {
        this.props.onModalClose(true);
      })
      .catch(function (error) {
        console.log("Subscription delete error: ", error);
      });
  }

  deletePlan() {
    Alert.alert('', 'Are you sure you want to delete this package?',
      [
        {
          text: 'Cancel'
        },
        {
          text: 'Yes',
          onPress: () => this.deletePlanFromDb()
        }
      ]);
  }

  checkIsNumber(val: string, field: string) {
    val = String(val);

    if (field === 'name' && !val.trim().length) {
      Alert.alert('', 'Please provide a valid value for package name');
      return false;
    }

    if (field !== 'name' && (!val.trim().length || !Number(val) || !Number.isInteger(Number(val)))) {
      Alert.alert('', 'Please provide a valid value for ' + field);
      return false;
    }

    return true;
  }

  updatePlanInDb() {
    const { modalVisible, ...planDetails } = this.state;
    planDetails.price = Number(planDetails.price);
    planDetails.validity = Number(planDetails.validity);
    planDetails.chatNumber = Number(planDetails.chatNumber);

    const db = this.db.collection("package_list").doc(this.state.id);

    db
      .get()
      .then(_ => {
        db.update(planDetails);

        this.props.onModalClose(true);
      })
      .catch(function (error) {
        console.log("Subscription list error: ", error);
      });
  }

  addPlanInDb() {
    const id = String(new Date().getTime());
    const db = this.db.collection("package_list");

    const { modalVisible, ...planDetails } = this.state;
    planDetails.id = id;
    planDetails.price = Number(planDetails.price);
    planDetails.validity = Number(planDetails.validity);
    planDetails.chatNumber = Number(planDetails.chatNumber);

    db
      .where('name', '==', planDetails.name.trim())
      .get()
      .then(doc => {
        if (doc.size) {
          Alert.alert('', 'Package with the same name exists, please chose another!');
          return;
        } else {
          db.doc(id).set(planDetails);
        }

        this.props.onModalClose(true);
      })
      .catch(function (error) {
        console.log("Subscription list error: ", error);
      });
  }

  updatePlan(isEdit: boolean) {
    let isValid = true;

    const fieldsArr = ['name', 'price', 'chatNumber', 'validity'];

    fieldsArr.every(item => {
      isValid = this.checkIsNumber(this.state[item], item);

      return isValid;
    });

    if (!isValid) return;

    Alert.alert('', 'Are you sure you want to proceed?',
      [
        {
          text: 'Cancel'
        },
        {
          text: 'Yes',
          onPress: () => {
            isEdit ? this.updatePlanInDb() : this.addPlanInDb()
          }
        }
      ]);


  }

  hideModal(type: string) {
    switch (type) {
      case 'edit':
      case 'add': this.updatePlan(type === 'edit');
        break;
      case 'delete': this.deletePlan();
        break;
      case 'close': this.props.onModalClose();
        break;
    }
  }

  render() {
    const { modalVisible } = this.state;

    return (
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
              <View style={{ margin: 20, width: '90%' }}>
                <View>
                  <TextInput
                    style={styles.inputStyle}
                    label="Package name"
                    value={this.state.name}
                    onChangeText={(val) => this.updateInputVal(val, 'name')}
                  />
                  <TextInput
                    style={styles.inputStyle}
                    label="Price"
                    keyboardType='numeric'
                    value={String(this.state.price)}
                    onChangeText={(val) => this.updateInputVal(val, 'price')}
                  />
                  <TextInput
                    style={styles.inputStyle}
                    label="Chat number"
                    keyboardType='numeric'
                    value={String(this.state.chatNumber)}
                    onChangeText={(val) => this.updateInputVal(val, 'chatNumber')}
                  />
                  <TextInput
                    style={styles.inputStyle}
                    keyboardType='numeric'
                    label="Validity in months"
                    value={String(this.state.validity)}
                    onChangeText={(val) => this.updateInputVal(val, 'validity')}
                  />
                </View>
              </View>
              {this.state.id &&
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => this.hideModal('delete')}>
                    <Text style={[styles.button, { color: 'red' }]}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.hideModal('edit')}>
                    <Text style={[styles.button, { color: '#2756ab' }]}>Edit</Text>
                  </TouchableOpacity>
                </View>
              }
              {this.state.id == null &&
                <TouchableOpacity onPress={() => this.hideModal('add')}>
                  <Text style={[styles.button, { color: '#2756ab' }]}>Add Plan</Text>
                </TouchableOpacity>
              }
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dcdcdc80'
  },
  modalView: {
    margin: 20,
    width: '90%',
    backgroundColor: "white",
    position: 'relative',
    borderRadius: 10,
    padding: 10,
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
  header: {
    color: '#2756ab',
    fontSize: 26,
    borderBottomColor: '#dcdcdc',
    borderBottomWidth: 1,
    alignSelf: 'center',
  },
  button: {
    fontSize: 24,
    margin: 20
  },
  clearBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1
  },
  inputStyle: {
    width: '100%',
    marginBottom: 25,
    padding: 0,
    alignSelf: "center",
    backgroundColor: '#fff',
    borderRadius: 2,
    color: '#000'
  }
});