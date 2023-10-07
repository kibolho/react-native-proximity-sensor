import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import SensorView from './SensorView';

export const App = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <SensorView />
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
