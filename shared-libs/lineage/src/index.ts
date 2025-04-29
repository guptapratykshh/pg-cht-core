import { DataContext } from '@medic/cht-datasource';
import { HydrationService } from './hydration';
import { ContactLoader } from './contact-loader';

export class Lineage {
  private hydrationService: HydrationService;
  private contactLoader: ContactLoader;

  constructor(context: DataContext) {
    this.hydrationService = new HydrationService(context);
    this.contactLoader = new ContactLoader(context);
  }

  async getDoc(id: string): Promise<any | null> {
    return this.hydrationService.getDoc(id);
  }

  async getDocs(ids: string[]): Promise<(any | null)[]> {
    return this.hydrationService.getDocs(ids);
  }

  async hydrateDoc(doc: any): Promise<any | null> {
    return this.hydrationService.hydrateDoc(doc);
  }

  async hydrateDocs(docs: any[]): Promise<(any | null)[]> {
    return this.hydrationService.hydrateDocs(docs);
  }
}

// Legacy compatibility function
export function createLineage(context: DataContext): Lineage {
  return new Lineage(context);
} 
