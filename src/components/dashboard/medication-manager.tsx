'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNotification } from '@/hooks/use-notification';
import { Bell, Pill, PlusCircle, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

type Medication = {
  id: number;
  name: string;
  dosage: string;
  time: string;
};

type FormValues = {
  name: string;
  dosage: string;
  time: string;
};

const initialMedications: Medication[] = [
  { id: 1, name: 'Lisinopril', dosage: '10mg', time: '08:00' },
  { id: 2, name: 'Metformin', dosage: '500mg', time: '20:00' },
];

export function MedicationManager() {
  const [medications, setMedications] =
    useState<Medication[]>(initialMedications);
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { requestPermission, scheduleNotification } = useNotification();

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const newMedication: Medication = {
      id: medications.length + 1,
      name: data.name,
      dosage: data.dosage,
      time: data.time,
    };
    setMedications((prev) => [newMedication, ...prev]);

    // Schedule notification
    const [hours, minutes] = data.time.split(':').map(Number);
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);

    let delay = reminderTime.getTime() - now.getTime();
    if (delay < 0) {
      // If time has passed for today, schedule for tomorrow
      reminderTime.setDate(reminderTime.getDate() + 1);
      delay = reminderTime.getTime() - now.getTime();
    }

    scheduleNotification(
      `Time for your ${data.name}`,
      `Don't forget to take your ${data.dosage} dose.`,
      delay
    );

    reset();
  };

  const deleteMedication = (id: number) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Add Medication</CardTitle>
            <CardDescription>Set up a new medication reminder.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medicine Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Aspirin"
                  {...register('name', { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 81mg"
                  {...register('dosage', { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Reminder Time</Label>
                <Input
                  id="time"
                  type="time"
                  {...register('time', { required: true })}
                />
              </div>
              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add & Schedule
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Medications</CardTitle>
            <CardDescription>
              A list of your scheduled medications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {medications.length > 0 ? (
              <div className="space-y-4">
                {medications.map((med) => (
                  <Card key={med.id} className="flex items-center p-4">
                    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Pill className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold">{med.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {med.dosage}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <div className="flex items-center gap-1">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-lg">{med.time}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMedication(med.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <Pill className="mx-auto h-12 w-12" />
                <p className="mt-4">You have no medications added yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
