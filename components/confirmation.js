import React, {Component} from 'react';
import { Text, View, StyleSheet, TextInput, Platform, Image,
  TouchableOpacity, Alert, Pressable, PermissionsAndroid, Dimensions} from 'react-native';

import auth from '@react-native-firebase/auth';

export default class Confirmation extends Component {
  constructor(props) {
    super(props);

    this.state = { number: "", confirm: null, invalidCount: 0, digitContainers: []}

    this.confirmCode = this.confirmCode.bind(this);

    this.inputRef = React.createRef();
    this.codeDigitsArray = new Array(code_length).fill('0');

    this.handleOnPress = this.handleOnPress.bind(this);
    this.getPermissionsAndroid = this.getPermissionsAndroid.bind(this);

    this.phone = this.props.route.params.number;

    auth().signInWithPhoneNumber(this.phone, true)
      .then((confirmation) => {
        console.log("here");
        this.setState({confirm: confirmation});
      })
      .catch(() => {
        Alert.alert("Invalid phone number, please try again");
        this.props.navigation.navigate('Signin');
      })
  }

  getPermissionsAndroid = async () => {

    try {
      const loc = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      const contacts = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS)

      if (loc && contacts) {
        this.props.navigation.navigate('Map', {uid: auth().currentUser.uid});
      } else {
        this.props.navigation.navigate('Signin');
      }
    } catch (error) {
      console.warn(error)
    }
  }

  confirmCode = async() => {
    console.log(this.state.number);
    try {
      await this.state.confirm.confirm(this.state.number)
      .then(() => {
          console.log("success");
          if (Platform.OS == 'android') {
            this.getPermissionsAndroid();
          }
          else {
            this.props.navigation.navigate('Map', {uid: auth().currentUser.uid})
          }
      });
    } catch (error) {
      if (this.state.invalidCount >= 2) {
        this.props.navigation.navigate('Signin');
      }

      this.state.invalidCount += 1;
      Alert.alert("Invalid code, you have " + (3-this.state.invalidCount) + " tries remaining ");
      console.log('Invalid code.');
    }
  }

  toDigitInput = (value, idx) => {
    const emptyChar = ' ';
    const digit = this.state.number[idx] || emptyChar;

    return (
      <View key={idx} style={styles.input_container}>
        <Text>{digit}</Text>
      </View>
    );
  }

  handleOnPress() {
    this.inputRef?.current?.focus();
  }
  
  render() {
    return (
      <View flex={1} backgroundColor="white">
        <View flex={2}>
          <Image source={require('./bkgd-squiggle.png')} style={styles.image}/>
        </View>

        <View style={styles.container}>
          <Text style={styles.title}>
            Confirmation
          </Text>
          <Text style={styles.subtitle}>
            Enter code
          </Text>
          <Text style={styles.paragraph}>
            Please type the 6-digit code sent to {this.phone}
          </Text>

          <Pressable style={styles.inputs_container} onPress={this.handleOnPress}>
            {this.codeDigitsArray.map(this.toDigitInput)}
          </Pressable>

          <View>
            {this.state.digitContainers}
            <TextInput
              ref={this.inputRef}
              style={styles.input}
              onChangeText={(number) => this.setState({number})}
              value={this.state.number}
              keyboardType="number-pad"
              maxLength={code_length}
              //add smth to limit it to 6 numbers
            />
          </View>

          <TouchableOpacity 
            onPress={this.confirmCode}>
            <View style = {styles.button}>
              <Text style={styles.buttonText}> Continue</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
    );
  }
}

const code_length = 6;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    marginLeft: 20
  },

  image: {
    width: '100%',
    height: Dimensions.get('window').height / 2,
    resizeMode: 'stretch',
  },

  inputs_container: {
    width: '100%',
    paddingRight: 20,
    paddingTop: 20,
    flexDirection: 'row',
  },

  input_container: {
    borderColor: 'grey',
    borderBottomWidth: 2,
    borderRadius: 4,
    padding: 12,
    marginRight: 15
  },

  title: {
    color: '#6CBCAE',
    fontWeight: 'bold',
    fontSize: 25,
    //marginTop: 100,
  },

  subtitle: {
    color: '#2D2323',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 30,
  },

  paragraph: {
    color: '#2D2323',
    fontSize: 14,
    marginTop: 15,
  },

  input: {
    height: 0,
    width: 0,
    opacity: 0
  },

    button: {
    backgroundColor: '#6CBCAE',
    height:50,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginTop: 20,
    borderRadius: 10,
  },

  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  }

});