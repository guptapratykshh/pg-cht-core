import 'mocha';
import { expect } from 'chai';
import { DataContext, Contact } from '@medic/cht-datasource';
import { Lineage } from '../src';
import { ContactWithLineage } from '../src/contact-loader';

describe('Lineage', () => {
  let lineage: Lineage;
  let mockContext: DataContext;
  let mockContact: Contact.v1.Contact;
  let mockContactWithLineage: ContactWithLineage;

  beforeEach(() => {
    mockContact = {
      _id: 'contact1',
      _rev: '1-abc',
      type: 'contact',
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
        if (qualifier.uuid === 'contact1') {
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

    lineage = new Lineage(mockContext);
  });

  describe('getDoc', () => {
    it('should fetch a contact by id', async () => {
      const result = await lineage.getDoc('contact1');
      expect(result).to.deep.equal(mockContact);
    });

    it('should return null for non-existent contact', async () => {
      const result = await lineage.getDoc('nonexistent');
      expect(result).to.be.null;
    });
  });

  describe('getDocs', () => {
    it('should fetch multiple contacts by ids', async () => {
      const result = await lineage.getDocs(['contact1', 'nonexistent']);
      expect(result).to.deep.equal([mockContact, null]);
    });
  });

  describe('hydrateDoc', () => {
    it('should hydrate a contact document with lineage', async () => {
      const result = await lineage.hydrateDoc({ ...mockContact });
      expect(result).to.deep.equal(mockContactWithLineage);
    });

    it('should hydrate a data record with patient and place', async () => {
      const dataRecord = {
        _id: 'report1',
        type: 'data_record',
        patient_id: 'contact1',
        place_id: 'contact1'
      };

      const result = await lineage.hydrateDoc(dataRecord);
      expect(result).to.deep.equal({
        ...dataRecord,
        patient: mockContactWithLineage,
        place: [mockContactWithLineage]
      });
    });

    it('should return null for null input', async () => {
      const result = await lineage.hydrateDoc(null);
      expect(result).to.be.null;
    });

    it('should return non-contact documents as-is', async () => {
      const doc = { _id: 'doc1', type: 'other' };
      const result = await lineage.hydrateDoc(doc);
      expect(result).to.deep.equal(doc);
    });
  });

  describe('hydrateDocs', () => {
    it('should hydrate multiple documents', async () => {
      const docs = [
        { ...mockContact },
        {
          _id: 'report1',
          type: 'data_record',
          patient_id: 'contact1',
          place_id: 'contact1'
        },
        null
      ];

      const result = await lineage.hydrateDocs(docs);
      expect(result).to.deep.equal([
        mockContactWithLineage,
        {
          _id: 'report1',
          type: 'data_record',
          patient_id: 'contact1',
          place_id: 'contact1',
          patient: mockContactWithLineage,
          place: [mockContactWithLineage]
        },
        null
      ]);
    });
  });
}); 
