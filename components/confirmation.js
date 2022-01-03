import React, {Component} from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, Pressable} from 'react-native';

import auth from '@react-native-firebase/auth';

export default class Confirmation extends Component {
  constructor(props) {
    super(props);

    this.state = { number: "", confirm: null, invalidCount: 0, digitContainers: []}

    this.confirmCode = this.confirmCode.bind(this);

    this.inputRef = React.createRef();
    this.codeDigitsArray = new Array(code_length).fill('0');

    this.handleOnPress = this.handleOnPress.bind(this);

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

  confirmCode = async() => {
    console.log(this.state.number);
    try {
      await this.state.confirm.confirm(this.state.number)
      .then(() => {
          console.log("success");
          this.props.navigation.navigate('Map', {uid: auth().currentUser.uid})
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
    );
  }
}

const code_length = 6;

const styles = StyleSheet.create({
 container: {
    flex: 1,
    marginLeft: 20
  },

  inputs_container: {
    width: '100%',
    paddingRight: 20,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  input_container: {
    borderColor: '#6CBCAE',
    borderWidth: 2,
    borderRadius: 4,
    padding: 12,
  },

  title: {
    color: '#6CBCAE',
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 100,
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