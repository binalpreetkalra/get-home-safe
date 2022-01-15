import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import SendSMS from 'react-native-sms';
import { selectContactPhone } from 'react-native-select-contact';

import {RandomHandle, Hash} from './websiteCode'

// import BackgroundTimer from 'react-native-background-timer';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';


export default class MapScreen extends Component {
    constructor(props) {
        super(props);

        this.state = { contacts:[], chosenCount: 0,
                    sessionStarted: false, color: default_col,
                    markers: [], order: 0, origin_lat: 0, origin_long: 0}

        //bind functions that depend of 'this'
        this.changeSession = this.changeSession.bind(this);
        this.openContacts = this.openContacts.bind(this);
        this.signout = this.signout.bind(this);

        this.uid = this.props.route.params.uid;

        //show initial contacts
        this.getSavedContacts();

        this.initialMapUpdate();
        //after initial map update, if there are locations saved, session started from before
        
        //start timer
        // this.watchPosition();
        // this.startTimer();
    }

    componentDidMount() {
        this.configureBackgroundTask();
    }

    componentWillUnmount() {
        // console.log("unmount");
        BackgroundGeolocation.removeAllListeners();
    }

    configureBackgroundTask() {
        // console.log("mount");
        BackgroundGeolocation.configure({
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 1,
            distanceFilter: 1,
            notificationTitle: 'Background tracking',
            notificationText: 'enabled',
            debug: false,
            startOnBoot: false,
            stopOnTerminate: true,
            locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
            interval: 5000,
            fastestInterval: 5000,
            activitiesInterval: 5000,
            stopOnStillActivity: false
          });

        BackgroundGeolocation.on("location", (location) => {
            let lat = location.latitude;
            let long = location.longitude;

            if (lat != this.state.origin_lat && long != this.state.origin_long){
                this.updateDatabase(location);
                this.setState({origin_lat: lat, origin_long: long});
                // console.log("lat: " + lat + " long: " + long);
            }
        })

        BackgroundGeolocation.on("start", () => {console.log("Background started")});

        BackgroundGeolocation.checkStatus(status => {
            console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
      
            // you don't need to check status before start (this is just the example)
            if (!status.isRunning) {
              BackgroundGeolocation.start(); //triggers start on start event
            }
        });

        BackgroundGeolocation.start();
    }

    changeSession() {
        // console.log("clicked");
        if (!this.state.sessionStarted){
            this.setState({sessionStarted: true, color: 'grey'});
            let message = "Keep an eye on my journey by visiting: " + this.getWebsiteLink();
            // console.log(message);
            this.sendSms(message);
        } else {
            // console.log("END");
            //send safety text
            this.setState({sessionStarted: false, color: default_col});
            //clear markers
            this.setState({markers: []});
            //clear stored locations
            database().ref("users/" + this.uid).child("locations").remove();
            database().ref("users/" + this.uid).child("verification").remove();

            this.sendSms("I have reached my destination!");
        }
    }

    getWebsiteLink () {
        let random = RandomHandle(10);
        let hash = Hash(random);
        database().ref("users/" + this.uid).child('verification').set(hash);

        return host_link + "/" + this.uid + "/" + random;
    }

    sendSms (message) {
        let sendContacts = []
        for (i=0; i<this.state.contacts.length; i++) {
            let c = this.state.contacts[i];
            if (c.check) {
                sendContacts = [...sendContacts, c.phone]
            }
        }

        SendSMS.send({
            body: message,
            recipients: sendContacts,
            successTypes: ['sent', 'queued'],
            allowAndroidSendWithoutReadPermission: true,
        }, (completed, cancelled, error) => {
            // console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
        });

    }

    // startTimer() {
    //     BackgroundTimer.runBackgroundTimer(() => {
    //         console.log("timer")
    //         Geolocation.getCurrentPosition(
    //             info => this.updateDatabase(info),
    //             error => console.log(error),
    //             {enableHighAccuracy: true, distanceFilter: min_distance }
    //         )
    //     },
    //     5000)
    // }

    // watchPosition () {
    //     Geolocation.watchPosition(
    //         info => this.updateDatabase(info),
    //         error => console.log(error),
    //         {enableHighAccuracy: true, interval: 3000, distanceFilter: min_distance})
    // }

    initialMapUpdate() { //call when app opened - all initial markers
        database().ref("users/" + this.uid + "/locations").once("value", snap =>
            {
            snap.forEach(childSnap =>
            {
                if (!this.state.sessionStarted) {
                    this.setState({sessionStarted: true})
                }
                let lat = childSnap.child('item/latitude').val();
                let long = childSnap.child('item/longitude').val();
                this.addMarker(lat, long);
                found = true;

            })
        });
    }

    updateDatabase = item => {
        //update map and database at the same time
        this.addMarker(item.latitude, item.longitude);
        //this.addMarker(item.coords.latitude, item.coords.longitude);

        //if session started, store info, otherwise just collect and display
        if (this.state.sessionStarted) {
            database().ref("users/" + this.uid + "/locations").push({
                item});
        }
    }

    addMarker(lat, long) {
        //update map focus once
        if (this.state.origin_lat == 0 && this.state.origin_long == 0){
            this.setState({origin_lat: lat, origin_long: long});
        }

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
        // console.log(loc);
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
        database().ref("users/" + this.uid + "/contacts").once("value", snap =>
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
        // console.log("add contact");
    
        this.setState({contacts: [...this.state.contacts, 
                                {name: name, phone: phone, check: false}]
                            });
        if (db)
            database().ref("users/" + this.uid + '/contacts').push({name: name, phone: phone});
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

        if (newVal)
            this.setState({chosenCount: this.state.chosenCount+1})
        else
            this.setState({chosenCount: this.state.chosenCount-1})
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
        database().ref("users/" + this.uid + "/contacts").once("value", snap =>
            {
            snap.forEach(childSnap =>
            {
                let name = childSnap.child('name').val();
                let phone = childSnap.child('phone').val();
                
                if (name == this.state.contacts[index].name && phone == this.state.contacts[index].phone) {
                    childSnap.ref.remove();

                    //delete from local array
                    let arr = this.state.contacts;
                    arr.splice(index, 1);
                    this.setState({contacts: arr});

                    return;
                }
            })
        });
    }

    renderOneContact(name, index) {
        return (
            <View style={styles.row} key={index}>

                <CheckBox
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
                        zoomEnabled = {true}
                        region = {{
                            latitude: this.state.origin_lat,
                            longitude: this.state.origin_long,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.015,
                        }}>
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
                        disabled = {this.state.chosenCount == 0 ? true : false}
                        // since dependent on state, add style here
                        style={{width: '75%',
                                height: 40,
                                borderRadius: 10,
                                justifyContent: 'center',
                                alignItems: 'center', 
                                backgroundColor: this.state.sessionStarted ? 'red' : this.state.chosenCount == 0 ? 'grey' : default_col}}
                        onPress={this.changeSession}>

                        <Text style={styles.session_text}>{this.state.sessionStarted? "End Session" : "Start Session"} </Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        )
    }
}

const default_col = '#6CBCAE';
const min_distance = 1; //HIGH accuracy
const host_link = "localhost:3000"

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