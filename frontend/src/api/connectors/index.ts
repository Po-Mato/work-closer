import { BubbleConnector } from './BubbleConnector';
import { WebflowConnector } from './WebflowConnector';
import type { Connector, ConnectorConfig, IdeaData, PrototypeTemplate } from './types';

export type Platform = 'bubble' | 'webflow';

const CONNECTOR_CLASSES: Record<Platform, new (config: ConnectorConfig) => Connector> = {
  bubble: BubbleConnector,
  webflow: WebflowConnector,
};

export function createConnector(platform: Platform, config: ConnectorConfig): Connector {
  const ConnectorClass = CONNECTOR_CLASSES[platform];
  return new ConnectorClass(config);
}

export async function createProjectFromIdea(
  platform: Platform,
  config: ConnectorConfig,
  idea: IdeaData
): Promise<{ projectId: string; projectUrl: string }> {
  const connector = createConnector(platform, config);
  return connector.createProject(idea);
}

export async function getAvailableTemplates(
  platform: Platform,
  config: ConnectorConfig
): Promise<PrototypeTemplate[]> {
  const connector = createConnector(platform, config);
  return connector.getTemplates();
}

export { BubbleConnector } from './BubbleConnector';
export { WebflowConnector } from './WebflowConnector';
export { BaseConnector } from './types';
export type { Connector, ConnectorConfig, IdeaData, PrototypeTemplate };
