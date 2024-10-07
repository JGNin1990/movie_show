import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import Home from './src/screens/Home';
import Detail from './src/screens/Detail';
import OfflineShow from './src/screens/OfflineShow';
import React from 'react';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import { Movie } from './src/helper/type';

type RootStackParamList = {
  Home: undefined; 
  MovieDetail: { movie: Movie; show: boolean };
  OfflineShow: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="MovieDetail" component={Detail} />
          <Stack.Screen name="OfflineShow" component={OfflineShow} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
