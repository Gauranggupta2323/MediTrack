'use client';

import { useCallback } from 'react';
import { useToast } from './use-toast';

export function useNotification() {
  const { toast } = useToast();

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        return true;
      }
    }
    return false;
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
        return null;
      }

      console.log(`Scheduling notification "${title}" in ${delay / 1000} seconds.`);

      const timeoutId = setTimeout(() => {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          tag: 'meditrack-reminder',
          requireInteraction: true,
        });
      }, delay);

      toast({
        title: 'Reminder Set!',
        description: `You'll be reminded about ${
          title.split(' ')[3] || 'your medication'
        } at the scheduled time.`,
      });

      return timeoutId;
    },
    [toast]
  );

  const cancelNotification = useCallback((timeoutId: number) => {
    clearTimeout(timeoutId);
  }, []);

  const showInstantNotification = useCallback((title: string, body: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: 'meditrack-instant',
        requireInteraction: false,
      });
    }
  }, []);

  return { 
    requestPermission, 
    scheduleNotification, 
    cancelNotification,
    showInstantNotification 
  };
}
