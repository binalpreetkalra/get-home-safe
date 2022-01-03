import * as React from 'react';
import { Text, View, StyleSheet, TextInput , TouchableOpacity} from 'react-native';

export default function Confirmation({navigation}) {
  
  const [number, onChangeNumber] = React.useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Grant access
      </Text>
      <Text style={styles.subtitle}>
        Location tracking & Contact Info
      </Text>
      <Text style={styles.paragraph}>
        You will be prompted to provide Get Home Safe access to your location and contacts in order to use this app. 
      </Text>
      <Text style={styles.paragraph}>
        This will only be used to track your location when you choose to share it with your trusted contacts.
      </Text>
      <TouchableOpacity 
        onPress={() => navigation.navigate("Map")}>
        <View style = {styles.button}>
          <Text style={styles.buttonText}> Continue</Text>
        </View>
        </TouchableOpacity>
    </View>
  );
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