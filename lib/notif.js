
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';

export async function askNotificationPermission() {
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

export function setNotifHandler() {
    //console.log(Notifications);
    Notifications.setNotificationHandler({
        handleNotification: async (notif) => {
            return {
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            };
        }
    });
}

export async function schedNotif(opts) {
    if (!('scheduleNotificationAsync' in Notifications)) {
        console.log('web does not support notification');
        return 'web-no-notification';
    }
    //setNotifHandler();
    // See: https://dev.to/chakrihacker/react-native-local-notifications-in-expo-24cm
    return await Notifications.scheduleNotificationAsync(opts); // return notification id
}


// useEffect(() => {
    //     const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    //         //const url = response.notification.request.content.data.url;

    //         console.log(response.notification.request.content);
    //         console.log(response.notification.request.identifier);

    //         navigation.navigate('ReminderDetail', {
    //             reminderText: response.notification.request.content.body,
    //             notificationId: response.notification.request.identifier
    //         });

    //         // Let React Navigation handle the URL
    //         //console.log(url);
    //     });
    //     return () => {
    //         subscription.remove();
    //     };
    // }, [navigation]);