import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import proximity from 'react-native-proximity-sensor';

const SensorValue: React.FC<any> = ({ name, value }) => (
  <View style={styles.valueContainer}>
    <Text style={styles.valueName}>{name}:</Text>
    <Text style={styles.valueValue}>{new String(value).substring(0, 8)}</Text>
  </View>
);

export const SensorView = () => {
  const [sensorValues, setSensorValues] = useState<{
    proximity: boolean | Number;
  } | null>(null);
  const sensorSubscriptionRef = useRef<any>();

  useEffect(() => {
    sensorSubscriptionRef.current = proximity.subscribe(
      (values: { proximity: boolean | Number }) => {
        setSensorValues({ ...values });
      }
    );

    return () => {
      if (sensorSubscriptionRef.current) {
        sensorSubscriptionRef.current.unsubscribe();
        sensorSubscriptionRef.current = null;
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Proximity values</Text>
      <SensorValue name={'proximity'} value={sensorValues?.proximity} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginVertical: 25,
    paddingBottom: 12,
  },
  headline: {
    fontSize: 30,
    margin: 10,
    color: '#333',
  },
  valueContainer: {
    flex: 1,
    marginHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  valueValue: {
    fontSize: 20,
    color: '#333',
    flex: 3,
  },
  valueName: {
    flex: 2,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default SensorView;
