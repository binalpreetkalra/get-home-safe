import React, {Component} from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Image, Dimensions } from 'react-native';

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
      <KeyboardAvoidingView flex={1} backgroundColor='white' enabled>
        {/* <View flex={2}>
         <Image source={require('./bkgd-squiggle.png')} style={styles.image}/>
        </View> */}

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
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    marginLeft: 40,
    marginRight: 40,
    justifyContent: 'center',
  },

  image: {
    width: '100%',
    height: Dimensions.get('window').height / 2,
    resizeMode: 'stretch',
  },

  title: {
    color: '#6CBCAE',
    fontWeight: 'bold',
    fontSize: 25,
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
    marginTop: 25,
    marginBottom: 20,
  },

  input: {
    color: '#999999',
    fontSize: 16,
    marginTop: 30,
    textDecorationLine: 'underline',
  },

    button: {
    backgroundColor: '#6CBCAE',
    height:50,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    marginTop: 30,
    borderRadius: 10,
  },

  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  }

});