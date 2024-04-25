import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import Constants from 'expo-constants';
//import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import {WebView} from 'react-native-webview'

const OhGireal ='https://oh-gireal.vercel.app/'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
export default function App() {

  const notificationListener = useRef();
  const responseListener = useRef();
  const [pushState,setPushState] = useState(null);
  const [expoPushToken,setExpoPushToken] = useState(null);

  useEffect(() => {
    // ④ユーザが通知をフォアグラウンドで開いた場合のリスナー
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setPushState("フォアグラウンドで通知を受信しました。");
    });

    // ⑤ユーザが通知を開いた場合のリスナー
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      setPushState("通知を開きました。")
    });
    // userEffectのreturnに登録する関数は、コンポーネントがunmountされるときに実行される。ここで主にcleanup処理を定義する
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* <View style={{width:'100%',height:'100%'}}> 
        <WebView
          source={{ uri: OhGireal }}
          onLoad={console.log('loaded')}
        />
      </View> */}
      <Button
        title="push通知用のトークンを取得"
        onPress={async () => {
          const pushToken = await registerForPushNotificationsAsync()
          setExpoPushToken(pushToken);
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    //①このアプリからのPush通知の許可を取得
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
       //②初回起動時は許可ダイアログを出してユーザからPush通知の許可を取得
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      //許可がない場合
      alert('Failed to get push token for push notification!');
      return;
    }
    //③通知用トークンの取得
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    //実機以外の場合
    alert('Must use physical device for Push Notifications');
  }
  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
