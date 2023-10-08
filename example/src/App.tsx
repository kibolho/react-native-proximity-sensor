import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  type LayoutChangeEvent,
  TouchableOpacity,
  View,
} from 'react-native';
import proximity from 'rn-proximity-sensor';
import type { SubscriptionRef } from 'rn-proximity-sensor';
import Shimmer from './components/Shimmer';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const App = () => {
  const [isShowingBalance, setIsShowingBalance] = useState<boolean>(false);
  const sensorSubscriptionRef = useRef<SubscriptionRef | null>(null);
  const balanceSize = useRef({ width: 100, height: 36 });

  const changeBalanceSize = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    balanceSize.current = { width, height };
  };

  useEffect(() => {
    sensorSubscriptionRef.current = proximity.subscribe((values) => {
      if (values.is_double_toggle) setIsShowingBalance((prev) => !prev);
    });

    return () => {
      if (sensorSubscriptionRef.current) {
        sensorSubscriptionRef.current.unsubscribe();
        sensorSubscriptionRef.current = null;
      }
    };
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Balance</Text>
      </View>
      <View style={styles.bodyContainer} onLayout={changeBalanceSize}>
        <Shimmer
          {...balanceSize.current}
          style={styles.linearGradient}
          stopAutoRun={true}
          isLoading={isShowingBalance}
        >
          <Text style={styles.text}>$ 1232.00</Text>
        </Shimmer>
        <TouchableOpacity
          onPress={() => {
            setIsShowingBalance((prev) => !prev);
          }}
        >
          <Ionicons name={isShowingBalance ? 'eye' : 'eye-off'} size={32} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginHorizontal: 32,
  },
  bodyContainer: {
    marginHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  linearGradient: {
    flex: 1,
    borderRadius: 5,
    marginRight: 16,
  },
  title: {
    fontSize: 22,
    margin: 5,
    color: '#333',
  },
  text: {
    fontSize: 24,
    margin: 10,
    color: '#333',
    fontWeight: 'bold',
  },
});
export default App;
