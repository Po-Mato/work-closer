export interface ConnectorConfig {
  apiKey?: string;
  baseUrl: string;
  timeout?: number;
}

export interface IdeaData {
  title: string;
  description: string;
  swotData?: {
    strengths: string;
    weaknesses: string;
    opportunities: string;
    threats: string;
  };
  bmcData?: {
    keyPartners: string;
    keyActivities: string;
    keyResources: string;
    valuePropositions: string;
    customerRelationships: string;
    channels: string;
    customerSegments: string;
    costStructure: string;
    revenueStreams: string;
  };
}

export interface PrototypeTemplate {
  id: string;
  name: string;
  description: string;
  platform: string;
  config: Record<string, unknown>;
}

export interface Connector {
  readonly platform: string;
  readonly platformName: string;

  isConfigured(): boolean;

  createProject(idea: IdeaData): Promise<{ projectId: string; projectUrl: string }>;
  createPage(projectId: string, name: string): Promise<{ pageId: string }>;
  addElement(pageId: string, element: Record<string, unknown>): Promise<{ elementId: string }>;
  deployProject(projectId: string): Promise<{ deployUrl: string }>;
  getTemplates(): Promise<PrototypeTemplate[]>;
}

export abstract class BaseConnector implements Connector {
  abstract readonly platform: string;
  abstract readonly platformName: string;
  config: ConnectorConfig;

  constructor(config: ConnectorConfig) {
    this.config = config;
  }

  abstract isConfigured(): boolean;
  abstract createProject(idea: IdeaData): Promise<{ projectId: string; projectUrl: string }>;
  abstract createPage(projectId: string, name: string): Promise<{ pageId: string }>;
  abstract addElement(pageId: string, element: Record<string, unknown>): Promise<{ elementId: string }>;
  abstract deployProject(projectId: string): Promise<{ deployUrl: string }>;
  abstract getTemplates(): Promise<PrototypeTemplate[]>;

  protected async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey ? { 'Authorization': `Bearer ${this.config.apiKey}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`${this.platform} API error: ${response.status} ${errorBody}`);
    }
    return response.json() as Promise<T>;
  }
}
