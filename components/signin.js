import React, {Component} from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from 'react-native';

import PhoneInput from "react-native-phone-number-input";

export default class Signin extends Component {
  constructor(props){
    super(props);
    this.state = { number: "" , code: "1"};

    this.sendNumber = this.sendNumber.bind(this);
  }

  sendNumber = async () => {
    let num = "+" + this.state.code + this.state.number;
    console.log(num);
    this.props.navigation.navigate("Confirmation", {number: num})
  }
  
  render(){
    return (
      <ImageBackground style={{flex: 1}} >
        <View style={styles.container}>
          <Text style={styles.title}>
            Sign in
          </Text>
          <Text style={styles.subtitle}>
            Enter phone number
          </Text>
          <Text style={styles.paragraph}>
            Use this as your quick log in to store your frequent contacts
          </Text>
          {/* <TextInput
            style={styles.input}
            onChangeText={(number) => this.setState({number})}
            value={this.state.number}
            placeholder="Enter phone number"
            keyboardType="numeric"
          /> */}
          <PhoneInput
            ref = {this.state.number}
            onChangeText={(number) => this.setState({number})}
            onChangeCountry={(country) => this.setState({code: country.callingCode})}
            defaultCode="CA"
          />
          <TouchableOpacity
            onPress={this.sendNumber}>
            <View style = {styles.button}>
              <Text style={styles.buttonText}> CONTINUE</Text>
            </View>
            </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 20
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
    color: '#999999',
    fontSize: 16,
    marginTop: 20,
    textDecorationLine: 'underline',
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