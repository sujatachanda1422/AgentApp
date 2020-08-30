import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import PlanModal from '../screens/planModal';
import firebase from '../database/firebase';
import { Entypo } from '@expo/vector-icons';

export default class SubscriptionPlans extends Component {
  db: firebase.firestore.Firestore;
  planArray: Array<Object> = [];

  constructor() {
    super();
    this.state = {
      planList: [],
      modalVisible: false,
      isLoading: false
    };

    this.db = firebase.firestore();
  }

  UNSAFE_componentWillMount() {
    this.getPackageList();

    this.props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            onPress={() => this.openPlanDetailsModal({})}>
            <Entypo name="add-to-list" size={32} color="white" style={{ marginRight: 20 }} />
          </TouchableOpacity>
        );
      }
    });
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  getPackageList = () => {
    this.setState({ isLoading: true });

    this.db.collection("package_list")
      .orderBy('price').get()
      .then(querySnapshot => {
        this.planArray = [];

        querySnapshot.forEach((doc) => {
          this.planArray.push(doc.data());
        });

        this.setState({ planList: [...this.planArray], isLoading: false });
      })
      .catch((error) => {
        this.setState({ isLoading: false });

        console.log("Subscription list rrror: ", error);
      });
  }

  openPlanDetailsModal = (item: any) => {
    this.setState({
      modalVisible: true,
      planSelected: { ...item }
    });
  }

  onModalClose = (data: any) => {
    // update takes time
    if (data) {
      this.setState({ modalVisible: false, isLoading: true });

      setTimeout(() => {
        this.getPackageList();
      }, 200);

      return
    }
    this.setState({ modalVisible: false });
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
          data={this.state.planList}
          width='100%'
          keyExtractor={(index) => index.id}
          renderItem={({ item }) =>
            <TouchableOpacity style={styles.item}
              onPress={() => this.openPlanDetailsModal(item)} >
              <View style={styles.listItem}>
                <Text style={[styles.listText, { fontSize: 20, color: 'blue' }]}>
                  {item.name}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.listText}>Price - {item.price}, </Text>
                  <Text style={styles.listText}>Chats - {item.chatNumber}, </Text>
                  {item.validity === 1 &&
                    <Text style={styles.listText}>
                      Validity - {item.validity} Month
                  </Text>
                  }
                  {item.validity > 1 &&
                    <Text style={styles.listText}>
                      Validity - {item.validity} Months
                  </Text>
                  }
                </View>
              </View>
              <View>
                <Entypo name="edit" size={24} color="black" />
              </View>
            </TouchableOpacity>
          }
        />

        {modalVisible &&
          <PlanModal plan={this.state.planSelected} onModalClose={this.onModalClose} />
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
    backgroundColor: '#aac8dc'
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
  }
});