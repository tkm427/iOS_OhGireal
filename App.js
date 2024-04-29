import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
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

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    // ④ユーザが通知をフォアグラウンドで開いた場合のリスナー
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
     // ⑤ユーザが通知を開いた場合のリスナー
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(expoPushToken);
      console.log(response);
    });

    return () => {
      // userEffectのreturnに登録する関数は、コンポーネントがunmountされるときに実行される。ここで主にcleanup処理を定義する
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      {/* <View style={{width:'100%',height:'100%'}}> 
        <WebView
          source={{ uri: OhGireal }}
          onLoad={console.log('loaded')}
        />
      </View> */}
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to get a token"
        onPress={async () => {
          await registerForPushNotificationsAsync();
        }}
      />
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}
//ローカル通知
async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
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
    token = (await Notifications.getExpoPushTokenAsync({ 
      projectId: '1139796b-5517-4098-be2e-b8eddb7b73ea', })).data;
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
