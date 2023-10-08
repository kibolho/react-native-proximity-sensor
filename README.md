# react-native-proximity-sensor

get proximity sensor data

## Installation

```sh
npm install react-native-proximity-sensor
```

## Usage

```js
import proximity, { SubscriptionRef } from 'react-native-proximity-sensor';

// ...

const sensorSubscriptionRef = useRef<SubscriptionRef | null>(null);

const [isShowingBalance, setIsShowingBalance] = useState<boolean>(false);

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
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
