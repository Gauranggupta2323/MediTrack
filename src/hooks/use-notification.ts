'use client';

import { useCallback } from 'react';
import { useToast } from './use-toast';

export function useNotification() {
  const { toast } = useToast();

  const requestPermission = useCallback(() => {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return;
    }

    if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }
  }, []);

  const scheduleNotification = useCallback(
    (title: string, body: string, delay: number) => {
      if (Notification.permission !== 'granted') {
        toast({
          title: 'Notifications Disabled',
          description:
            'Please enable notifications in your browser settings to receive reminders.',
          variant: 'destructive',
        });
        return;
      }

      console.log(`Scheduling notification "${title}" in ${delay / 1000} seconds.`);

      setTimeout(() => {
        new Notification(title, {
          body,
        });
      }, delay);

      toast({
        title: 'Reminder Set!',
        description: `You'll be reminded about ${
          title.split(' ')[3]
        } at the scheduled time.`,
      });
    },
    [toast]
  );

  return { requestPermission, scheduleNotification };
}
