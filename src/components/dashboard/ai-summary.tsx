'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Sparkles } from 'lucide-react';
import { useState } from 'react';

const mockHealthSummary = `Based on your recent logs, your blood pressure appears to be generally well-managed, with an average of 125/84 mmHg. There was a slight increase noted around October 5th, which coincided with your medication schedule for Lisinopril. 

Key Observations:
- **Consistency:** You have been consistent with logging your BP readings daily.
- **Medication Adherence:** Your medication schedule seems consistent.
- **Recommendation:** Continue monitoring your BP, especially in the mornings. Consider discussing the slight peak on Oct 5th with your doctor during your next visit.

This is not medical advice. Always consult a healthcare professional.`;

export function AiSummary() {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setSummary(null);
    // Simulate AI call
    await new Promise((res) => setTimeout(res, 2500));
    setSummary(mockHealthSummary);
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Health Summary</CardTitle>
        <CardDescription>
          Get an AI-generated summary of your health data for quick insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGenerateSummary} disabled={isLoading}>
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? 'Generating...' : 'Generate Summary'}
        </Button>

        {isLoading && (
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}

        {summary && (
          <Card className="bg-background/50">
            <CardHeader className="flex flex-row items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <CardTitle className="text-lg">Your Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-foreground/80">{summary}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
