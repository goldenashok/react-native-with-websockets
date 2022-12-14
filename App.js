import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import { useState, useEffect, useRef } from 'react';

//npx expo install react-native-web@~0.18.9 react-dom@18.1.0 @expo/webpack-config@^0.17.2
export default function App() {
  const [serverState, setServerState] = useState('Loading...');
  const [messageText, setMessageText] = useState('');
  const [disableButton, setDisableButton] = useState(true);
  const [inputFieldEmpty, setInputFieldEmpty] = useState(true);
  const [serverMessages, setServerMessages] = useState([]);
  const webProtocol = window.location.protocol || '';
  let socketProtocol = webProtocol === 'http:' && 'ws' || 'wss'
  var ws = useRef(new WebSocket(socketProtocol + '://localhost:5000')).current;

  useEffect(() => {
    const serverMessagesList = [];
    ws.onopen = () => {
      setServerState('Connected to the server')
      setDisableButton(false);
    };
    ws.onclose = (e) => {
      setServerState('Disconnected. Check internet or server.')
      setDisableButton(true);
    };
    ws.onerror = (e) => {
      setServerState(e.message);
    };
    ws.onmessage = (e) => {
      serverMessagesList.push(e.data);
      setServerMessages([...serverMessagesList])
    };
  }, []);

  const submitMessage = () => {
    ws.send(messageText);
    setMessageText('')
    setInputFieldEmpty(true)
  }

  return (
    <View style={styles.container}>
      <View style={{
        height: 30,
        backgroundColor: '#eeceff',
        padding: 5
      }}>
        <Text>{serverState}</Text>
      </View>

      <View style={{
        backgroundColor: '#ffeece',
        padding: 5,
        flexGrow: 1
      }}>
        <ScrollView>
          {
            serverMessages.map((item, ind) => {
              return (
                <Text key={ind}>{item}</Text>
              )
            })
          }
        </ScrollView>
      </View>

      <View style={{
        flexDirection: 'row',

      }}>
        <TextInput style={{
          borderWidth: 1,
          borderColor: 'black',
          flexGrow: 1,
          padding: 5,
        }}
          placeholder={'Add Message'}
          onChangeText={text => {
            setMessageText(text)
            setInputFieldEmpty(text.length > 0 ? false : true)
          } }
          value={messageText}
          />
        <Button
          onPress={submitMessage}
          title={'Submit'}
          disabled={disableButton || inputFieldEmpty}
          />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingTop: 30,
    padding: 8,
  },
});
