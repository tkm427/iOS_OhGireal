import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {WebView} from 'react-native-webview'

const OhGireal ='https://oh-gireal.vercel.app/'
export default function App() {
  return (
    <View style={styles.container}>
      <View style={{width:'100%',height:'100%'}}> 
        <WebView
          source={{ uri: OhGireal }}
          onLoad={console.log('loaded')}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
