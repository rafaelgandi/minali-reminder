import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

export default function useNotificationRecievedListener(callback, isFocused) {
    useEffect(() => {
        let subscription = null;
        subscription = Notifications.addNotificationResponseReceivedListener(response => {
            //console.log(response.notification.request);
            //console.log('using listener');
            isFocused && callback(response.notification.request.identifier);
        });
        return () => {
            subscription.remove();
        };   
    }, [isFocused]);
}