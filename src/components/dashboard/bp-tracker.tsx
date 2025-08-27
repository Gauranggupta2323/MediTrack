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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useState } from 'react';
import { PlusCircle, ArrowDownUp } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';

type BPReading = {
  id: number;
  systolic: number;
  diastolic: number;
  date: string;
  time: string;
};

type FormValues = {
  systolic: number;
  diastolic: number;
};

const initialReadings: BPReading[] = [
  { id: 1, systolic: 120, diastolic: 80, date: '2023-10-01', time: '08:00 AM' },
  { id: 2, systolic: 122, diastolic: 81, date: '2023-10-02', time: '08:05 AM' },
  { id: 3, systolic: 118, diastolic: 78, date: '2023-10-03', time: '08:10 AM' },
  { id: 4, systolic: 125, diastolic: 85, date: '2023-10-04', time: '08:00 AM' },
  { id: 5, systolic: 130, diastolic: 88, date: '2023-10-05', time: '08:15 AM' },
  { id: 6, systolic: 128, diastolic: 86, date: '2023-10-06', time: '08:00 AM' },
];

const chartConfig = {
  systolic: { label: 'Systolic', color: 'hsl(var(--primary))' },
  diastolic: { label: 'Diastolic', color: 'hsl(var(--accent))' },
};

export function BPTracker() {
  const [readings, setReadings] = useState<BPReading[]>(initialReadings);
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const newReading: BPReading = {
      id: readings.length + 1,
      systolic: Number(data.systolic),
      diastolic: Number(data.diastolic),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setReadings((prev) => [newReading, ...prev]);
    reset();
  };

  const chartData = readings
    .slice(0, 7)
    .reverse()
    .map((r) => ({
      ...r,
      name: new Date(r.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    }));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="grid-cols-1 space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>BP Trends</CardTitle>
            <CardDescription>
              Your blood pressure trends over the last 7 readings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <LineChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey="systolic"
                  type="monotone"
                  stroke="var(--color-systolic)"
                  strokeWidth={2}
                  dot={true}
                />
                <Line
                  dataKey="diastolic"
                  type="monotone"
                  stroke="var(--color-diastolic)"
                  strokeWidth={2}
                  dot={true}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reading History</CardTitle>
            <CardDescription>
              Your complete blood pressure reading history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <ArrowDownUp className="h-4 w-4" />
                      <span>SYS/DIA</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {readings.map((reading) => (
                  <TableRow key={reading.id}>
                    <TableCell>
                      {new Date(reading.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{reading.time}</TableCell>
                    <TableCell className="text-right font-medium">
                      {reading.systolic}/{reading.diastolic}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Log New Reading</CardTitle>
          <CardDescription>
            Enter your systolic and diastolic pressure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="systolic">Systolic (mm Hg)</Label>
              <Input
                id="systolic"
                type="number"
                placeholder="120"
                {...register('systolic', { required: true, valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diastolic">Diastolic (mm Hg)</Label>
              <Input
                id="diastolic"
                type="number"
                placeholder="80"
                {...register('diastolic', {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </div>
            <Button type="submit" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Reading
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
