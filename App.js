import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Button, Keyboard } from 'react-native';
import * as Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';

import { screenHeaderOptions } from '$styles/Global.styles.js'

import HomeScreen from '$screens/HomeScreen/HomeScreen.js'
import DetailsScreen from '$screens/DetailsScreen/DetailsScreen.js'


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
        labelStyle: { color: '#fff', fontWeight: 'bold'},
        activeBackgroundColor: '#9AA1AC'
    };
    return (
        <DrawerContentScrollView {...props}>
            <Text style={{padding: 20, fontWeight: 'bold', fontSize: 30, color: '#fff'}}>Minali Reminders</Text>
            <DrawerItemList {...newProps} />         
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
                        shouldPlaySound: false,
                        shouldSetBadge: false,
                    }),
                });
            })();
        }
    }, []);
    return (
        <NavigationContainer>
            <Drawer.Navigator 
                initialRouteName="Home" 
                drawerStyle={{
                    backgroundColor: '#3C3F43',
                    color: '#fff'
                }} 
                drawerContent={(props) => <MinaliDrawerContent {...props} />}
            >
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen options={{ title: 'Details' }} name="Details" component={DetailsScreen} />
            </Drawer.Navigator>

            <StatusBar style="light" />
        </NavigationContainer>
    );
}
