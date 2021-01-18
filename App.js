import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { askNotificationPermission, setNotifHandler } from '$lib/notif.js';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import HomeScreen from '$screens/HomeScreen/HomeScreen.js';
import ReminderListScreen from '$screens/ReminderListScreen/ReminderListScreen.js';
import AboutScreen from '$screens/AboutScreen/AboutScreen.js'
import ReminderDetailScreen from '$screens/ReminderDetailScreen/ReminderDetailScreen.js';
import linking from '$lib/deep-linking-config.js';
import globalStyles from '$styles/Global.styles.js' 

const Drawer = createDrawerNavigator();
let firstRun = true;

function MinaliDrawerContent(props) {
    // See: https://reactnavigation.org/docs/drawer-navigator/
    let newProps = {
        ...props,
        labelStyle: { color: '#fff', fontWeight: 'bold' },
        activeBackgroundColor: '#000'
    };
    // See: https://stackoverflow.com/questions/62204060/how-to-hide-drawer-item-in-react-navigation-5x
    const { state, ...rest } = newProps;
    const newState = { ...state };
    newState.routes = newState.routes.filter((item) => item.name !== 'ReminderDetail');
    return (
        <DrawerContentScrollView {...props}>
            <Text style={{ padding: 20, fontWeight: 'bold', fontSize: 30, color: '#fff' }}>Minali Reminders 🎯</Text>
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
                setNotifHandler();
                if (! await AsyncStorage.getItem('MinaliReminders@list')) {
                    AsyncStorage.setItem('MinaliReminders@list', JSON.stringify([]));
                }
            })();
        }
    }, []);
    return (
        <NavigationContainer 
            linking={linking} 
            fallback={
                <View style={globalStyles.container}>
                    <Text style={{color:'#fff', padding:20, textAlign:'center'}}>👋 Hello...</Text>
                </View>             
            }
        >
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
                <Drawer.Screen options={{ title: 'About' }} name="About" component={AboutScreen} />

                <Drawer.Screen options={{ title: 'Reminder Detail' }} name="ReminderDetail" component={ReminderDetailScreen} />
            </Drawer.Navigator>

            <StatusBar style="light" />
        </NavigationContainer>
    );
}
