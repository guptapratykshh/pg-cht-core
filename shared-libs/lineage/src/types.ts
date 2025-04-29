import { Contact } from '@medic/cht-datasource';
import * as sinon from 'sinon';

export interface DataContext {
  bind: (fn: any) => (qualifier: { uuid: string }) => Promise<any>;
  Contact: {
    v1: {
      get: sinon.SinonStub<[string], Promise<Contact.v1.Contact | null>>;
      getWithLineage: sinon.SinonStub<[string], Promise<Contact.v1.ContactWithLineage | null>>;
    };
  };
} 
