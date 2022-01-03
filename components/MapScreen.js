import React, {Component} from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  View,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import database from '@react-native-firebase/database';
import MapView from 'react-native-maps';

export default class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [
        {name: 'hello', phone: '1', check: false},
        {name: 'hello2', phone: '2', check: false},
        {name: 'hello3', phone: '3', check: false},
        {name: 'hello4', phone: '4', check: false},
        {name: 'hello5', phone: '5', check: false},
        {name: 'hello6', phone: '6', check: false},
        {name: 'hello7', phone: '7', check: false},
      ],
      shareLocation: false,
      sessionStarted: false,
      color: default_col,
    };

    //bind functions that depend of 'this'
    this.startSession = this.startSession.bind(this);
  }

  addContact(name, phone) {
    if (this.shareLocation === false) this.setState({shareLocation: true});
    this.state.setState({
      contacts: [
        ...this.state.contacts,
        {name: name, phone: phone, check: false},
      ],
    });
  }

  handleCheckBoxChanged(index, newVal) {
    //shallow copy
    let items = [...this.state.contacts];

    //copy item and update
    let item = {...items[index]};
    item.check = newVal;

    //modify array and state
    items[index] = item;
    this.setState({contacts: items});
  }

  renderContacts() {
    if (this.state.contacts.length == 0) {
      return (
        <Text style={(styles.info, {color: default_col, padding: 20})}>
          Add contacts to get started!
        </Text>
      );
    }

    return this.state.contacts.map((obj, index) =>
      this.renderOneContact(obj.name, index),
    );
  }

  deleteContact(index) {
    console.log('delete: ' + index);
    let arr = this.state.contacts;
    arr.splice(index, 1);
    this.setState({contacts: arr});
  }

  renderOneContact(name, index) {
    return (
      <View style={styles.row} key={index}>
        <CheckBox
          disabled={this.state.sessionStarted}
          tintColors={{true: this.state.color}}
          value={this.state.contacts[index]['check']}
          onValueChange={newValue =>
            this.handleCheckBoxChanged(index, newValue)
          }
        />

        <Text> {name} </Text>
        <View style={styles.right_container}>
          <TouchableOpacity onPress={() => this.deleteContact(index)}>
            <Image source={require('./del.png')} style={styles.del_image} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  startSession() {
    console.log('clicked');
    this.setState({sessionStarted: true, color: 'grey'});
  }

  render() {
    return (
      <SafeAreaView>
        {/* welcome heading */}
        <Text style={styles.heading_large}>Welcome!</Text>
        <Text style={styles.info}>Your current location</Text>

        {/* map */}
        <View alignItems="center">
          <MapView style={styles.map} zoomEnabled={true}>
            {/* {this.renderMarkers()} */}
          </MapView>
        </View>

        {/* header contacts row */}
        <View paddingTop={20} />
        <View style={styles.row}>
          <Text style={styles.heading_small}> Contacts</Text>
          <View style={styles.right_container}>
            <TouchableOpacity style={styles.round_button_small}>
              <Text style={styles.add_contact}> + add contact </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.info}>
          Select the people you would like to share your location with.
        </Text>

        {/* all contacts  */}
        <ScrollView style={styles.scroll}>{this.renderContacts()}</ScrollView>

        {/* bottom button */}
        <View style={styles.footer}>
          <TouchableOpacity
            // since dependent on state, add style here
            style={{
              width: '75%',
              height: 40,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: this.state.color,
            }}
            onPress={this.startSession}>
            <Text style={styles.session_text}>Share Location</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const default_col = '#6CBCAE';

const styles = StyleSheet.create({
  heading_large: {
    fontSize: 35,
    color: default_col,
    fontWeight: 'bold',
    paddingLeft: 20,
    paddingTop: 30,
  },
  heading_small: {
    fontSize: 25,
    color: default_col,
    fontWeight: 'bold',
  },
  add_contact: {
    fontSize: 10,
  },
  info: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    fontSize: 16,
  },
  row: {
    paddingLeft: 20,
    paddingRight: 20,
    //flexWrap: "wrap",
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  right_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  round_button_small: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderColor: default_col,
    borderWidth: 3,
  },
  del_image: {
    height: 20,
    width: 20,
  },
  session_text: {
    color: 'white',
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: Dimensions.get('window').height / 3,
  },
  scroll: {
    flexDirection: 'column',
    height: Dimensions.get('window').height / 5,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
});
