
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';


export default {
    prefixes: ['minali://'],
    // See: https://reactnavigation.org/docs/configuring-links
    config: {
        screens: {
            ReminderDetail: {
                path: 'reminder/:id',
                parse: {
                    id: (id) => `${id}` // notification id
                }
            }
        }
    },
    // See: https://docs.expo.io/versions/latest/sdk/notifications/#addnotificationreceivedlistenerlistener-event-notification--void-void
    // See: https://reactnavigation.org/docs/deep-linking
    subscribe(listener) {
        const onReceiveURL = ({ url }) => {
            //console.log(url);
            return listener(url);
        };

        // Listen to incoming links from deep linking
        Linking.addEventListener('url', onReceiveURL);
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            //console.log(response.notification.request);
            // Let React Navigation handle the URL
            listener('minali://reminder/' + response.notification.request.identifier);
        });

        return () => {
            // Clean up the event listeners
            Linking.removeEventListener('url', onReceiveURL);
            subscription.remove();
        };
    }
};