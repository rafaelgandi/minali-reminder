import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import * as Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-community/async-storage'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import { screenHeaderOptions } from '$styles/Global.styles.js'

import HomeScreen from '$screens/HomeScreen/HomeScreen.js'
import ReminderListScreen from '$screens/ReminderListScreen/ReminderListScreen.js'
import AboutScreen from '$screens/AboutScreen/AboutScreen.js'
import ReminderDetailScreen from '$screens/ReminderDetailScreen/ReminderDetailScreen.js'


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator(); 
let firstRun = true;


async function askNotificationPermission() {
    try {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;

        console.log(`Notifications permission: ${finalStatus}`);


        if (existingStatus !== "granted") {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            return false;
        }
        return true;
    }
    catch (e) {
        console.log('A permission error occured ' + e.message);
        return false;
    }
}

function MinaliStackNav() {
    return (
        <Stack.Navigator screenOptions={screenHeaderOptions}>
            <Stack.Screen options={{ title: 'Minali Reminders' }} name="Home" component={HomeScreen} />
            <Stack.Screen options={{ title: 'Details' }} name="Details" component={DetailsScreen} />
        </Stack.Navigator>
    );
}

function MinaliDrawerContent(props) {
    // See: https://reactnavigation.org/docs/drawer-navigator/
    let newProps = {
        ...props,
        labelStyle: { color: '#fff', fontWeight: 'bold' },
        activeBackgroundColor: '#9AA1AC'
    };
    // See: https://stackoverflow.com/questions/62204060/how-to-hide-drawer-item-in-react-navigation-5x
    const { state, ...rest } = newProps;
    const newState = { ...state };
    newState.routes = newState.routes.filter((item) => item.name !== 'ReminderDetail');
    return (
        <DrawerContentScrollView {...props}>
            <Text style={{ padding: 20, fontWeight: 'bold', fontSize: 30, color: '#fff' }}>Minali Reminders</Text>
            <DrawerItemList state={newState} {...rest} />
        </DrawerContentScrollView>
    );
}


export default function App() {
    useEffect(() => {
        if (firstRun) {
            firstRun = false;
            (async () => {
                await askNotificationPermission();
                //console.log(Notifications);
                Notifications.setNotificationHandler({
                    handleNotification: async () => ({
                        shouldShowAlert: true,
                        shouldPlaySound: true,
                        shouldSetBadge: true,
                    }),
                });
                if (! await AsyncStorage.getItem('MinaliReminders@list')) {
                    AsyncStorage.setItem('MinaliReminders@list', JSON.stringify([]));
                }
            })();
        }
    }, []);
    return (
        <NavigationContainer fallback={<Text>Loading...</Text>}>
            <Drawer.Navigator
                initialRouteName="SetReminder"
                drawerStyle={{
                    backgroundColor: '#3C3F43',
                    color: '#fff'
                }}
                drawerContent={(props) => <MinaliDrawerContent {...props} />}
            >
                <Drawer.Screen options={{ title: 'Set Reminder' }} name="SetReminder" component={HomeScreen} />
                <Drawer.Screen options={{ title: 'Reminder List' }} name="ReminderList" component={ReminderListScreen} />
                <Drawer.Screen options={{ title: 'Reminder Detail' }} name="ReminderDetail" component={ReminderDetailScreen} />
                <Drawer.Screen options={{ title: 'About' }} name="About" component={AboutScreen} />
            </Drawer.Navigator>

            <StatusBar style="light" />
        </NavigationContainer>
    );
}
