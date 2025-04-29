import 'mocha';
import { expect } from 'chai';
import { DataContext, Contact } from '@medic/cht-datasource';
import { ContactLoader, ContactWithLineage } from '../src/contact-loader';

describe('ContactLoader', () => {
  let contactLoader: ContactLoader;
  let mockContext: DataContext;
  let mockContact: Contact.v1.Contact;
  let mockContactWithLineage: ContactWithLineage;

  beforeEach(() => {
    mockContact = {
      _id: 'test-id',
      _rev: '1-abc',
      type: 'person',
      name: 'Test Person',
      parent: { _id: 'place1' }
    };

    mockContactWithLineage = {
      ...mockContact,
      lineage: [
        { _id: 'place1', _rev: '1-def', type: 'clinic', name: 'Test Clinic' }
      ]
    };

    mockContext = {
      bind: (fn: any) => async (qualifier: any) => {
        if (qualifier.uuid === 'test-id') {
          if (fn === Contact.v1.get) {
            return mockContact;
          }
          if (fn === Contact.v1.getWithLineage) {
            return mockContactWithLineage;
          }
        }
        return null;
      }
    } as DataContext;

    contactLoader = new ContactLoader(mockContext);
  });

  describe('fetchContactById', () => {
    it('should fetch a contact by id', async () => {
      const result = await contactLoader.fetchContactById('test-id');
      expect(result).to.deep.equal(mockContact);
    });
  });

  describe('fetchContactWithLineage', () => {
    it('should fetch a contact with lineage', async () => {
      const result = await contactLoader.fetchContactWithLineage('test-id');
      expect(result).to.deep.equal(mockContactWithLineage);
    });
  });

  describe('fetchContactsWithLineage', () => {
    it('should fetch multiple contacts with lineage', async () => {
      const result = await contactLoader.fetchContactsWithLineage(['test-id-1', 'test-id-2']);
      expect(result).to.deep.equal([null, null]);
    });
  });

  describe('fetchLinkedContacts', () => {
    it('should fetch linked contacts from a document', async () => {
      const doc = {
        _id: 'doc1',
        linked_docs: {
          patient: 'patient-id',
          place: 'place-id'
        }
      };

      const result = await contactLoader.fetchLinkedContacts(doc);
      expect(result).to.deep.equal({
        patient: null,
        place: null
      });
    });

    it('should handle documents without linked_docs', async () => {
      const doc = { _id: 'doc1' };
      const result = await contactLoader.fetchLinkedContacts(doc);
      expect(result).to.deep.equal({});
    });
  });
}); 
