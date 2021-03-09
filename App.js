import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { askNotificationPermission, setNotifHandler } from '$lib/notif.js';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import HomeScreen from '$screens/HomeScreen/HomeScreen';
import ReminderListScreen from '$screens/ReminderListScreen/ReminderListScreen';
import AboutScreen from '$screens/AboutScreen/AboutScreen'
import ReminderDetailScreen from '$screens/ReminderDetailScreen/ReminderDetailScreen';
import BackupRestore from '$screens/BackupRestore/BackupRestore';
import globalStyles from '$styles/Global.styles.js'
import routes from '$lib/routes.js';
import { FontAwesome } from '@expo/vector-icons';

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
    newState.routes = newState.routes.filter((item) => (item.name !== routes.reminderDetail));
    return (
        <DrawerContentScrollView {...props}>         
            <Text style={{ padding: 20, fontWeight: 'bold', fontSize: 30, color: '#fff' }}>                          
                Minali <FontAwesome name="bell" size={30} color="#54FFC3" /> Reminders                
            </Text>
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
                setNotifHandler();
                if (! await AsyncStorage.getItem('MinaliReminders@list')) {
                    AsyncStorage.setItem('MinaliReminders@list', JSON.stringify([]));
                }
            })();
        }
    }, []);

    return (
        <NavigationContainer
            fallback={
                <View style={globalStyles.container}>
                    <Text style={{ color: '#fff', padding: 20, textAlign: 'center' }}>👋 Hello...</Text>
                </View>
            }
        >
            <Drawer.Navigator
                initialRouteName={routes.setReminder}
                drawerStyle={{
                    backgroundColor: '#3C3F43',
                    color: '#fff'
                }}
                drawerContent={(props) => <MinaliDrawerContent {...props} />}
            >
                <Drawer.Screen options={{ title: 'Set Reminder' }} name={routes.setReminder} component={HomeScreen} />
                <Drawer.Screen options={{ title: 'Reminder List' }} name={routes.reminderList} component={ReminderListScreen} />
                <Drawer.Screen options={{ title: 'Backup and Import' }} name={routes.backUpRestore} component={BackupRestore} />
                <Drawer.Screen options={{ title: 'About' }} name={routes.about} component={AboutScreen} />
                <Drawer.Screen options={{ title: 'Reminder Detail' }} name={routes.reminderDetail} component={ReminderDetailScreen} />
            </Drawer.Navigator>

            <StatusBar style="light" />
        </NavigationContainer>
    );
}
