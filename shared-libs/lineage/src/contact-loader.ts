import { Contact, DataContext, Qualifier } from '@medic/cht-datasource';

export interface ContactWithLineage extends Contact.v1.ContactWithLineage {
  patient?: Contact.v1.ContactWithLineage;
  place?: Contact.v1.ContactWithLineage;
}

export class ContactLoader {
  constructor(private context: DataContext) {}

  async fetchContactById(id: string): Promise<Contact.v1.Contact | null> {
    return this.context.bind(Contact.v1.get)(Qualifier.byUuid(id));
  }

  async fetchContactWithLineage(id: string): Promise<ContactWithLineage | null> {
    return this.context.bind(Contact.v1.getWithLineage)(Qualifier.byUuid(id)) as Promise<ContactWithLineage | null>;
  }

  async fetchContactsWithLineage(ids: string[]): Promise<(ContactWithLineage | null)[]> {
    return Promise.all(
      ids.map(id => this.fetchContactWithLineage(id))
    );
  }

  async fetchLinkedContacts(doc: any): Promise<{ [key: string]: Contact.v1.Contact | null }> {
    if (!doc.linked_docs || typeof doc.linked_docs !== 'object') {
      return {};
    }

    const linkedDocs: { [key: string]: Contact.v1.Contact | null } = {};
    for (const [key, id] of Object.entries(doc.linked_docs)) {
      if (typeof id === 'string') {
        linkedDocs[key] = await this.fetchContactById(id);
      }
    }
    return linkedDocs;
  }
} 
