import React, {Component} from 'react';
import { Text, View, StyleSheet, TouchableHighlight, ImageBackground, Dimensions} from 'react-native';

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
        <ImageBackground source={require('./bkgd.png')} style={styles.bkgd}>
          <ImageBackground source={require('./circle.png')} style={styles.circle}>
            <Text style={styles.title}>
              GET HOME {"\n"}SAFE
            </Text>
          </ImageBackground>
          <View style={styles.buttonContainer}>
          <TouchableHighlight style={styles.button}
            onPress={this.continue}>
              <Text style={styles.buttonText}> GET STARTED</Text>
            </TouchableHighlight>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bkgd: {
    width: '100%',
    height: '100%'
  },
  circle: {
    marginTop: 50,
    width: Dimensions.get('window').width * 0.6,
    height: Dimensions.get('window').width * 0.6,
    alignSelf: 'center',
    justifyContent: 'center',
  },
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
    alignSelf: 'center',
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