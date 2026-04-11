import { useState, useEffect, useCallback } from 'react';
import { fetchExperiment, postEvent } from '../api/ab';
import type { ExperimentResponse } from '../types';

export function useAbExperiment(key: string) {
  const [variant, setVariant] = useState<string>('control');

  useEffect(() => {
    const stored = localStorage.getItem(`ab_${key}`);
    if (stored) {
      setVariant(stored);
      return;
    }

    fetchExperiment(key).then((data: ExperimentResponse) => {
      setVariant(data.assigned_variant);
      localStorage.setItem(`ab_${key}`, data.assigned_variant);
    }).catch(() => {
      setVariant('control');
    });
  }, [key]);

  const track = useCallback(
    (eventType: string) => {
      postEvent({ experiment_key: key, variant, event_type: eventType }).catch(
        (err) => console.error('AB event tracking failed:', err)
      );
    },
    [key, variant]
  );

  return { variant, track };
}
