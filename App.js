import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Map from './components/MapScreen';
import Home from './components/home';
import Signin from './components/signin';
import Confirmation from './components/confirmation';
import Access from './components/access';

const Stack = createStackNavigator();

export default class App extends React.Component {
  
  render() {
    return(
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name = 'Home' component={Home} options={{ headerShown: false }}/>
          <Stack.Screen name = 'Signin' component={Signin} options={{ headerShown: false }}/>
          <Stack.Screen name = 'Confirmation' component={Confirmation} options={{ headerShown: false }}/>
          <Stack.Screen name = 'Access' component={Access} options={{ headerShown: false }}/>
          <Stack.Screen name="Map" component={Map} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}
