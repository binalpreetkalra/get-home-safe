import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import SendSMS from 'react-native-sms';
import { selectContactPhone } from 'react-native-select-contact';

export default class MapScreen extends Component {
    constructor(props) {
        super(props);

        this.state = { contacts:[] ,
                    sessionStarted: false, color: default_col,
                    markers: [], order: 0}

        //bind functions that depend of 'this'
        this.startSession = this.startSession.bind(this);
        this.openContacts = this.openContacts.bind(this);
        this.signout = this.signout.bind(this);

        this.uid = this.props.route.params.uid;

        //show initial contacts
        this.getSavedContacts();

        //start timer
        this.initialMapUpdate();
        this.watchPosition();
    }

    startSession() {
        console.log("clicked");
        this.setState({sessionStarted: true, color: 'grey'});
        this.sendSms();
    }

    sendSms () {
        for (i=0; i<this.state.contacts.length; i++) {
            let c = this.state.contacts[i];
            if (c.check) {
                SendSMS.send({
                    body: "send link here",
                    recipients: [c.phone],
                    successTypes: ['sent', 'queued'],
                    allowAndroidSendWithoutReadPermission: true,
                }, (completed, cancelled, error) => {
                    console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
                });
            }
        }
    }

    watchPosition () {
        Geolocation.watchPosition(
            info => this.updateDatabase(info),
            error => console.log(error),
            {enableHighAccuracy: true, interval: 3000, distanceFilter: 10})
    }

    initialMapUpdate() { //call when app opened - all initial markers
        database().ref(this.uid + "/locations").once("value", snap =>
            {
            snap.forEach(childSnap =>
            {
                let lat = childSnap.child('item/coords/latitude').val();
                let long = childSnap.child('item/coords/longitude').val();
                this.addMarker(lat, long);
            })
        });
    }

    updateDatabase = item => {
        console.log("lat: " + item.coords.latitude + " long " + item.coords.longitude)
        //update map and database at the same time
        this.addMarker(item.coords.latitude, item.coords.longitude);

        //if session started, store info, otherwise just collect and display
        if (this.state.sessionStarted) {
            database().ref(this.uid + "/locations").push({
                item});
        }
    }

    addMarker(lat, long) {
        if (this.state.sessionStarted) {
            this.setState({order: this.state.order+1});

            this.setState({ markers: [...this.state.markers, 
                {latitude: lat, 
                longitude: long, 
                order: this.state.order
            }] })
        } else {
            this.setState({ markers: 
                [{ latitude: lat, 
                longitude: long, 
                order: this.state.order}]
            })
        }  
    }

    renderMarker(loc) {
        console.log(loc);
        return (
            <MapView.Marker
                coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
                key={loc.order}
            />
        );
    }

    renderMarkers() {
        if (this.state.markers.length == 0) return;
        return this.state.markers.map(this.renderMarker);
    }

    getSavedContacts() {
        database().ref(this.uid + "/contacts").once("value", snap =>
            {
            snap.forEach(childSnap =>
            {
                let name = childSnap.child('name').val();
                let phone = childSnap.child('phone').val();
                this.addContact(name, phone, false);
            })
        });
    }

    addContact (name, phone, db) {
        console.log("add contact");
    
        this.setState({contacts: [...this.state.contacts, 
                                {name: name, phone: phone, check: false}]
                            });
        if (db)
            database().ref(this.uid + '/contacts').push({name: name, phone: phone});
    }

    openContacts () {
        selectContactPhone().then(selection => {
            this.addContact(selection.contact.name, selection.contact.phones[0].number, true);
        })
    }

    signout() {
        auth().signOut().then(() => this.props.navigation.navigate('Home'));
    }

    handleCheckBoxChanged (index, newVal) {
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
        if (this.state.contacts.length == 0)
        {
            return (
                <Text style={styles.info, {color: default_col, padding: 20}}>
                    Add contacts to get started!
                </Text>
            );
        }
        return this.state.contacts.map((obj, index) => this.renderOneContact(obj.name, index));
    }

    deleteContact (index) {
        //delete from database
        database().ref(this.uid + "/contacts").once("value", snap =>
            {
            snap.forEach(childSnap =>
            {
                let name = childSnap.child('name').val();
                let phone = childSnap.child('phone').val();
                
                if (name == this.state.contacts[index].name && phone == this.state.contacts[index].phone) {
                    childSnap.ref.remove();
                }
            })
        });

        //delete from local array
        let arr = this.state.contacts;
        arr.splice(index, 1);
        this.setState({contacts: arr}, () => console.log(this.state.contacts));

    }

    renderOneContact(name, index) {
        return (
            <View style={styles.row} key={index}>

                <CheckBox disabled={this.state.sessionStarted} 
                        tintColors={{true: this.state.color}}
                        value={this.state.contacts[index]['check']}
                        onValueChange={(newValue) => this.handleCheckBoxChanged(index, newValue)}/>

                <Text> {name} </Text>
                <View style={styles.right_container}>
                    <TouchableOpacity onPress={() => this.deleteContact(index)}>
                        <Image source={require('./del.png')} style={styles.del_image}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    render () {
        return (
            <View>
                {/* welcome heading */}
                <View style={styles.row} paddingTop={30}>
                    <Text style={styles.heading_large}>Welcome!</Text>
                    <View style={styles.right_container}>
                        <TouchableOpacity onPress={this.signout}>
                            <Image source={require('./signout.png')} style={styles.signout_image}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.info}>Your current location</Text>

                {/* map */}
                <View alignItems='center'>
                    <MapView style = {styles.map}
                        zoomEnabled = {true}>
                        {this.renderMarkers()}
                    </MapView>
                </View>

                {/* header contacts row */}
                <View paddingTop={20}/>
                <View style={styles.row}>
                    <Text style={styles.heading_small}> Contacts</Text>
                    <View style={styles.right_container}>
                        <TouchableOpacity style={styles.round_button_small}
                            onPress={this.openContacts}>
                            <Text style={styles.add_contact}> + add contact </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.info}>Select the people you would like to share your location with.</Text>
                
                {/* all contacts  */}
                <ScrollView style={styles.scroll}>
                    {this.renderContacts()}
                </ScrollView>

                {/* bottom button */}
                <View style={styles.footer}>
                    <TouchableOpacity 
                        // since dependent on state, add style here
                        style={{width: '75%',
                                height: 40,
                                borderRadius: 10,
                                justifyContent: 'center',
                                alignItems: 'center', 
                                backgroundColor: this.state.color,
                                disabled: this.state.sessionStarted}}
                        onPress={this.startSession}>

                        <Text style={styles.session_text}>Share Location</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const default_col = '#6CBCAE';

const styles = StyleSheet.create({
    heading_large: {
        fontSize: 35,
        color: default_col,
        fontWeight: 'bold',
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
        flexDirection: "row",
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
    signout_image: {
        height: 30,
        width: 30,
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
        height: Dimensions.get('window').height / 5
    },
    footer: {
        alignItems:'center',
        justifyContent:'center',
        padding: 40, 
        flexDirection:'column',
        justifyContent:'flex-end'
    }
});