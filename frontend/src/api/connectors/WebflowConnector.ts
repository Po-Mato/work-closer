import { BaseConnector, type IdeaData, type PrototypeTemplate } from './types';

export class WebflowConnector extends BaseConnector {
  readonly platform = 'webflow';
  readonly platformName = 'Webflow';

  isConfigured(): boolean {
    return !!this.config.apiKey && !!this.config.baseUrl;
  }

  async createProject(idea: IdeaData): Promise<{ projectId: string; projectUrl: string }> {
    const response = await this.request<{ id: string; previewUrl: string }>(
      'POST',
      '/v1/sites',
      {
        name: idea.title,
        description: idea.description,
      }
    );
    return {
      projectId: response.id,
      projectUrl: response.previewUrl,
    };
  }

  async createPage(projectId: string, name: string): Promise<{ pageId: string }> {
    const response = await this.request<{ id: string }>(
      'POST',
      `/v1/sites/${projectId}/pages`,
      { name }
    );
    return { pageId: response.id };
  }

  async addElement(pageId: string, element: Record<string, unknown>): Promise<{ elementId: string }> {
    const response = await this.request<{ id: string }>(
      'POST',
      `/v1/pages/${pageId}/elements`,
      element
    );
    return { elementId: response.id };
  }

  async deployProject(projectId: string): Promise<{ deployUrl: string }> {
    const response = await this.request<{ deployUrl: string }>(
      'POST',
      `/v1/sites/${projectId}/publish`
    );
    return { deployUrl: response.deployUrl };
  }

  async getTemplates(): Promise<PrototypeTemplate[]> {
    return [
      {
        id: 'webflow-blank',
        name: 'Blank Site',
        description: 'Start with a clean slate',
        platform: 'webflow',
        config: {},
      },
      {
        id: 'webflow-portfolio',
        name: 'Portfolio',
        description: 'Personal portfolio template',
        platform: 'webflow',
        config: { template: 'portfolio' },
      },
      {
        id: 'webflow-ecommerce',
        name: 'E-commerce',
        description: 'Online store template with products and checkout',
        platform: 'webflow',
        config: { template: 'ecommerce' },
      },
    ];
  }
}
