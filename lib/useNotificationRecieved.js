import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

export default function useNotificationRecieved(callback) {
    const lastNotificationResponse = Notifications.useLastNotificationResponse();
    // See: https://docs.expo.io/versions/v40.0.0/sdk/notifications/#uselastnotificationresponse-undefined--notificationresponse--null
    useEffect(() => {
        // console.log(Notifications.DEFAULT_ACTION_IDENTIFIER);
        // console.log(lastNotificationResponse);
        if (lastNotificationResponse && lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
            /*
                Object {
                    "actionIdentifier": "expo.modules.notifications.actions.DEFAULT", 
                    "notification": Object {
                        "date": 1611465269657,
                        "request": Object {
                        "content": Object {
                            "autoDismiss": true,
                            "badge": null,
                            "body": "Rrrrrt",
                            "data": null,
                            "sound": "default",
                            "sticky": false,
                            "subtitle": null,
                            "title": "Reminder",
                        },
                        "identifier": "06e6ab01-08da-46b6-9743-edb9abb04701",
                        "trigger": Object {
                            "channelId": null,
                            "repeats": false,
                            "type": "date",
                            "value": 1611465269000,
                        },
                        },
                    },
                }
            */
            //console.log('using hoook');
            callback(lastNotificationResponse.notification.request.identifier);
        }
    }, [lastNotificationResponse]);
}