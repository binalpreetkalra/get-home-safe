import React, {Component} from 'react';
import { Text, View, StyleSheet, TouchableHighlight, ImageBackground} from 'react-native';

import auth from '@react-native-firebase/auth';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {user: false}
    this.continue = this.continue.bind(this);

    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({user: true}, () => console.log("EXISTS"));
      } else {
        this.setState({user: false});
      }
   });
  }

  continue() {
    if (this.state.user)
      this.props.navigation.navigate("Map", {uid: auth().currentUser.uid})
    else
      this.props.navigation.navigate("Signin")
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          GET HOME {"\n"}SAFE
        </Text>
        <View style={styles.buttonContainer}>
        <TouchableHighlight style={styles.button}
          onPress={this.continue}>
            <Text style={styles.buttonText}> GET STARTED</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    color: '#6CBCAE',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 35,
    marginTop: 100,
  },

  buttonContainer: {
    width: "100%",
    flex: 1,
    justifyContent: 'flex-end'
  },

  button: {
    backgroundColor: '#6CBCAE',
    height:70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
  }
});