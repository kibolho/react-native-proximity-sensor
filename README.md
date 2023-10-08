# rn-proximity-sensor

Retrieve proximity sensor data from IOS and Android.

## Installation

```sh
npm install rn-proximity-sensor
```

## Usage

```js
import proximity, { SubscriptionRef } from 'rn-proximity-sensor';

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

The subscribe callback function will return ```values``` with the following properties:
| Property         | Description           | Support        |
| -----------      | -----------           | -----------    |
| distance         | Number - 0 to 10cm    | Android & IOS* |
| is_close         | boolean               | Android & IOS  |
| is_toggle        | boolean - toggle from one state to another              | Android & IOS  |
| is_double_toggle | boolean - toggle from not close state to close and back to not close              | Android & IOS  |

* Since in IOS we just have a boolean as the returned value of the sensor we mapped:
  - is_close = true to 0 cm
  - is_close = false to 10 cm

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
