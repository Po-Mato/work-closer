import { BaseConnector, type IdeaData, type PrototypeTemplate } from './types';

export class BubbleConnector extends BaseConnector {
  readonly platform = 'bubble';
  readonly platformName = 'Bubble.io';

  isConfigured(): boolean {
    return !!this.config.apiKey && !!this.config.baseUrl;
  }

  async createProject(idea: IdeaData): Promise<{ projectId: string; projectUrl: string }> {
    const response = await this.request<{ id: string; url: string }>(
      'POST',
      '/v1/apps',
      {
        label: idea.title,
        name: this.sanitizeName(idea.title),
      }
    );
    return {
      projectId: response.id,
      projectUrl: response.url,
    };
  }

  async createPage(projectId: string, name: string): Promise<{ pageId: string }> {
    const response = await this.request<{ id: string }>(
      'POST',
      `/v1/apps/${projectId}/pages`,
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
    const response = await this.request<{ url: string }>(
      'POST',
      `/v1/apps/${projectId}/deploy`
    );
    return { deployUrl: response.url };
  }

  async getTemplates(): Promise<PrototypeTemplate[]> {
    return [
      {
        id: 'bubble-blank',
        name: 'Blank App',
        description: 'Start from scratch with a blank canvas',
        platform: 'bubble',
        config: {},
      },
      {
        id: 'bubble-marketplace',
        name: 'Marketplace',
        description: 'Basic marketplace template with listings and users',
        platform: 'bubble',
        config: { template: 'marketplace' },
      },
      {
        id: 'bubble-saas',
        name: 'SaaS Starter',
        description: 'SaaS application with authentication and billing',
        platform: 'bubble',
        config: { template: 'saas' },
      },
    ];
  }

  private sanitizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
