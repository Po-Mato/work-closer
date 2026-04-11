const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ExperimentResponse {
  key: string;
  variants: Record<string, number>;
  active: boolean;
  assigned_variant: string;
}

export interface EventPayload {
  experiment_key: string;
  variant: string;
  event_type: string;
  user_id?: string;
}

export async function fetchExperiment(key: string): Promise<ExperimentResponse> {
  const response = await fetch(`${API_BASE_URL}/ab/experiments/${key}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch experiment: ${response.status}`);
  }
  return response.json() as Promise<ExperimentResponse>;
}

export async function postEvent(payload: EventPayload): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/ab/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Failed to post event: ${response.status}`);
  }
  return response.json() as Promise<{ status: string }>;
}
