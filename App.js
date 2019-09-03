/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { PermissionsAndroid, GeoConfiguration } from 'react-native';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import Geolocation from '@react-native-community/geolocation';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\nShake or press menu button for dev menu',
});

const firebaseCredentials = Platform.select({
  ios: 'https://invertase.link/firebase-ios',
  android: 'https://invertase.link/firebase-android',
});

type Props = {};

export default class App extends Component<Props> {
  constructor() {
    super();
    this.state = {
      token: 'abc',
      location: ''
    }
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await Geolocation.getCurrentPosition(
          position => {
            const location = JSON.stringify(position);
            this.setState({ location });
          },
          error => console.log('error', error),
          { timeout: 20000, maximumAge: 1000 }
        );
      } else {
      }
    } catch (err) {
      console.warn(err);
    }
  };

  async getToken() {
    messaging().subscribeToTopic('abc');
    this.messageListener = messaging().onMessage((message: RemoteMessage) => {
      console.log('message from fcm', message)
    });

  }

  async sendMessage() {
    messaging().sendMessage({
      to: '448825878918@gcm.googleapis.com',
      messageId: '123213213',
      data: {
        key1: 'value1',
        key2: 'value2',
      }
    });
  }

  handleNotification() {
    // this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
    //   console.log('removeNotificationDisplayedListener', notification)
    // });
    // this.removeNotificationListener = firebase.notifications().onNotification((notification) => {
    //   console.log('removeNotificationListener', notification)
    // });
    // this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    //   // Get the action triggered by the notification being opened
    //   const action = notificationOpen.action;
    //   // Get information about the notification that was opened
    //   const notification = notificationOpen.notification;
    //   console.log(action, notification);
    // });
  }
  componentDidMount() {
    this.requestLocationPermission();
    this.handleNotification();
    this.getToken()
    this.sendMessage();
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{this.state.token}</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        {!firebase.apps.length && (
          <Text style={styles.instructions}>
            {`\nYou currently have no Firebase apps registered, this most likely means you've not downloaded your project credentials. Visit the link below to learn more. \n\n ${firebaseCredentials}`}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
