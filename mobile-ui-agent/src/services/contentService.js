// Content Service - Centralized content fetching from subject agents
// Handles videos, podcasts, slides, and other learning materials

class ContentService {
  constructor() {
    this.baseUrls = {
      chemistry: 'http://localhost:3011', // chemistry-agent
      biology: 'http://localhost:3012'     // biology-agent
    };
    
    // Content type mappings for different agents
    this.contentTypes = {
      podcast: 'audio',
      video: 'video',
      slides: 'document'
    };
  }

  // Fetch content metadata for a specific dot point
  async fetchContentMetadata(subject, moduleId, dotPointId) {
    try {
      const agent = subject.toLowerCase();
      const baseUrl = this.baseUrls[agent];
      
      if (!baseUrl) {
        console.warn(`No agent URL configured for subject: ${subject}`);
        return this.getFallbackContent(subject, moduleId, dotPointId);
      }

      const endpoint = `${baseUrl}/api/content/${moduleId}/${dotPointId}`;
      console.log(`📚 Fetching content metadata from: ${endpoint}`);
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        console.warn(`Failed to fetch content from ${endpoint}: ${response.status}`);
        return this.getFallbackContent(subject, moduleId, dotPointId);
      }
      
      const data = await response.json();
      return this.formatContentMetadata(data);
      
    } catch (error) {
      console.warn(`Error fetching content for ${subject} ${moduleId} ${dotPointId}:`, error);
      return this.getFallbackContent(subject, moduleId, dotPointId);
    }
  }

  // Format content metadata from agent response
  formatContentMetadata(data) {
    if (!data || !data.content) {
      console.warn('Invalid content data format received');
      return null;
    }

    const content = data.content;
    
    return {
      podcast: content.podcast ? {
        id: content.podcast.id,
        title: content.podcast.title,
        url: content.podcast.url,
        duration: content.podcast.duration || 15,
        description: content.podcast.description || '',
        accessed: false
      } : null,
      
      video: content.video ? {
        id: content.video.id,
        title: content.video.title,
        url: content.video.url,
        duration: content.video.duration || 12,
        description: content.video.description || '',
        accessed: false
      } : null,
      
      slides: content.slides ? {
        id: content.slides.id,
        title: content.slides.title,
        url: content.slides.url,
        pages: content.slides.pages || 20,
        description: content.slides.description || '',
        accessed: false
      } : null
    };
  }

  // Fallback content when agents are unavailable
  getFallbackContent(subject, moduleId, dotPointId) {
    console.log(`📚 Using fallback content for ${subject} ${moduleId} ${dotPointId}`);
    
    // Basic fallback content structure
    const fallbackContent = {
      chemistry: {
        'module-5': {
          'IQ1.1': {
            podcast: {
              id: 'fallback-chem-podcast-1',
              title: 'Gas Laws and Real-World Applications',
              url: '/content/chemistry/module5/IQ1.1/podcast.mp3',
              duration: 18,
              description: 'Explore how gas laws apply in everyday situations',
              accessed: false
            },
            video: {
              id: 'fallback-chem-video-1',
              title: 'Ideal Gas Law Calculations',
              url: '/content/chemistry/module5/IQ1.1/video.mp4',
              duration: 15,
              description: 'Step-by-step gas law problem solving',
              accessed: false
            },
            slides: {
              id: 'fallback-chem-slides-1',
              title: 'Gas Laws Study Guide',
              url: '/content/chemistry/module5/IQ1.1/slides.pdf',
              pages: 28,
              description: 'Comprehensive notes on gas behavior',
              accessed: false
            }
          }
        }
      },
      biology: {
        'module-5': {
          'IQ1.1': {
            podcast: {
              id: 'fallback-bio-podcast-1',
              title: 'Reproductive Strategies in Nature',
              url: '/content/biology/module5/IQ1.1/podcast.mp3',
              duration: 15,
              description: 'Explore different reproductive methods across species',
              accessed: false
            },
            video: {
              id: 'fallback-bio-video-1',
              title: 'Cell Division and Species Survival',
              url: '/content/biology/module5/IQ1.1/video.mp4',
              duration: 12,
              description: 'How reproduction ensures species continuity',
              accessed: false
            },
            slides: {
              id: 'fallback-bio-slides-1',
              title: 'Reproduction Presentation Notes',
              url: '/content/biology/module5/IQ1.1/slides.pdf',
              pages: 24,
              description: 'Key concepts in reproductive biology',
              accessed: false
            }
          }
        }
      }
    };

    return fallbackContent[subject]?.[moduleId]?.[dotPointId] || {
      podcast: null,
      video: null,
      slides: null
    };
  }

  // Track content access
  async trackContentAccess(subject, moduleId, dotPointId, contentType, contentId, userId = 'demo-user') {
    try {
      const agent = subject.toLowerCase();
      const baseUrl = this.baseUrls[agent];
      
      if (!baseUrl) {
        console.log(`📊 Content access tracked locally: ${contentType} for ${dotPointId}`);
        return { success: true, message: 'Tracked locally' };
      }

      const response = await fetch(`${baseUrl}/api/content/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          moduleId,
          dotPointId,
          contentType,
          contentId,
          accessedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`📊 Content access tracked: ${contentType} for ${dotPointId}`);
        return { success: true, data: result };
      } else {
        console.warn(`Failed to track content access: ${response.status}`);
        return { success: false, message: 'Tracking failed' };
      }
      
    } catch (error) {
      console.warn(`Error tracking content access:`, error);
      return { success: false, message: error.message };
    }
  }

  // Get content delivery URL (for streaming, downloads, etc.)
  async getContentUrl(subject, contentId, contentType) {
    try {
      const agent = subject.toLowerCase();
      const baseUrl = this.baseUrls[agent];
      
      if (!baseUrl) {
        // Return placeholder URL for development
        return `/content/${subject}/${contentType}/${contentId}`;
      }

      const response = await fetch(`${baseUrl}/api/content/url/${contentId}`);
      
      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        console.warn(`Failed to get content URL for ${contentId}`);
        return `/content/${subject}/${contentType}/${contentId}`;
      }
      
    } catch (error) {
      console.warn(`Error getting content URL:`, error);
      return `/content/${subject}/${contentType}/${contentId}`;
    }
  }

  // Get content analytics and usage statistics
  async getContentAnalytics(subject, moduleId, userId = 'demo-user') {
    try {
      const agent = subject.toLowerCase();
      const baseUrl = this.baseUrls[agent];
      
      if (!baseUrl) return null;

      const response = await fetch(`${baseUrl}/api/content/analytics/${moduleId}?userId=${userId}`);
      
      if (response.ok) {
        return await response.json();
      }
      
      return null;
    } catch (error) {
      console.warn(`Error fetching content analytics:`, error);
      return null;
    }
  }

  // Check content availability and quality
  async checkContentHealth(subject, moduleId) {
    try {
      const agent = subject.toLowerCase();
      const baseUrl = this.baseUrls[agent];
      
      if (!baseUrl) return { available: false, reason: 'Agent unavailable' };

      const response = await fetch(`${baseUrl}/api/content/health/${moduleId}`, {
        signal: AbortSignal.timeout(3000)
      });
      
      if (response.ok) {
        const health = await response.json();
        return {
          available: true,
          contentCount: health.contentCount || 0,
          lastUpdated: health.lastUpdated,
          quality: health.quality || 'unknown'
        };
      }
      
      return { available: false, reason: 'Health check failed' };
    } catch (error) {
      return { available: false, reason: error.message };
    }
  }

  // Preload content for better user experience
  async preloadContent(subject, moduleId, dotPointIds) {
    const preloadResults = [];
    
    for (const dotPointId of dotPointIds) {
      try {
        const content = await this.fetchContentMetadata(subject, moduleId, dotPointId);
        preloadResults.push({
          dotPointId,
          success: content !== null,
          content
        });
      } catch (error) {
        preloadResults.push({
          dotPointId,
          success: false,
          error: error.message
        });
      }
    }
    
    console.log(`📚 Preloaded content for ${preloadResults.length} dot points`);
    return preloadResults;
  }
}

// Create singleton instance
const contentService = new ContentService();

export default contentService;