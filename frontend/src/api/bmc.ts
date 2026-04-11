import type { BusinessModelCanvas } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface BMCResponse {
  id: string;
  keyPartners: string;
  keyActivities: string;
  keyResources: string;
  valuePropositions: string;
  customerRelationships: string;
  channels: string;
  customerSegments: string;
  costStructure: string;
  revenueStreams: string;
  createdAt: string;
  updatedAt: string;
}

export async function createBMC(): Promise<BMCResponse> {
  const response = await fetch(`${API_BASE_URL}/bmc`, { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Failed to create BMC: ${response.status}`);
  }
  return response.json() as Promise<BMCResponse>;
}

export async function fetchBMC(bmcId: string): Promise<BMCResponse> {
  const response = await fetch(`${API_BASE_URL}/bmc/${bmcId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch BMC: ${response.status}`);
  }
  return response.json() as Promise<BMCResponse>;
}

export async function listBMCs(): Promise<BMCResponse[]> {
  const response = await fetch(`${API_BASE_URL}/bmc`);
  if (!response.ok) {
    throw new Error(`Failed to list BMCs: ${response.status}`);
  }
  return response.json() as Promise<BMCResponse[]>;
}

export async function updateBMC(
  bmcId: string,
  updates: Partial<BusinessModelCanvas>
): Promise<BMCResponse> {
  const body: Record<string, string> = {};
  if (updates.keyPartners !== undefined) body.keyPartners = updates.keyPartners;
  if (updates.keyActivities !== undefined) body.keyActivities = updates.keyActivities;
  if (updates.keyResources !== undefined) body.keyResources = updates.keyResources;
  if (updates.valuePropositions !== undefined) body.valuePropositions = updates.valuePropositions;
  if (updates.customerRelationships !== undefined) body.customerRelationships = updates.customerRelationships;
  if (updates.channels !== undefined) body.channels = updates.channels;
  if (updates.customerSegments !== undefined) body.customerSegments = updates.customerSegments;
  if (updates.costStructure !== undefined) body.costStructure = updates.costStructure;
  if (updates.revenueStreams !== undefined) body.revenueStreams = updates.revenueStreams;

  const response = await fetch(`${API_BASE_URL}/bmc/${bmcId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Failed to update BMC: ${response.status}`);
  }
  return response.json() as Promise<BMCResponse>;
}