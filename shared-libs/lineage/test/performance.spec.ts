import { expect } from 'chai';
import { performanceMonitor, MonitoredContactLoader, MonitoredHydrationService, MonitoredLineage } from '../src/performance';
import { DataContext } from '@medic/cht-datasource';
import { stub } from 'sinon';

describe('Performance Monitoring', () => {
  let context: DataContext;

  beforeEach(() => {
    // Reset metrics before each test
    performanceMonitor.getMetrics().length = 0;
    // Create a stub context that implements the required interface
    context = {
      bind: stub().returnsThis(),
      // Add other required methods as needed
    } as unknown as DataContext;
  });

  describe('PerformanceMonitor', () => {
    it('should record metrics for successful operations', async () => {
      const startTime = Date.now();
      await performanceMonitor.record('testOperation', 100, true);
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).to.have.lengthOf(1);
      expect(metrics[0].operation).to.equal('testOperation');
      expect(metrics[0].duration).to.equal(100);
      expect(metrics[0].success).to.be.true;
      expect(metrics[0].error).to.be.undefined;
    });

    it('should record metrics for failed operations', async () => {
      const startTime = Date.now();
      await performanceMonitor.record('testOperation', 100, false, 'Test error');
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).to.have.lengthOf(1);
      expect(metrics[0].operation).to.equal('testOperation');
      expect(metrics[0].duration).to.equal(100);
      expect(metrics[0].success).to.be.false;
      expect(metrics[0].error).to.equal('Test error');
    });

    it('should calculate average duration', async () => {
      await performanceMonitor.record('testOperation', 100, true);
      await performanceMonitor.record('testOperation', 200, true);
      
      const avgDuration = performanceMonitor.getAverageDuration('testOperation');
      expect(avgDuration).to.equal(150);
    });

    it('should calculate success rate', async () => {
      await performanceMonitor.record('testOperation', 100, true);
      await performanceMonitor.record('testOperation', 200, false);
      await performanceMonitor.record('testOperation', 300, true);
      
      const successRate = performanceMonitor.getSuccessRate('testOperation');
      expect(successRate).to.equal(2/3);
    });
  });

  describe('MonitoredContactLoader', () => {
    it('should monitor fetchContactById', async () => {
      const loader = new MonitoredContactLoader(context);
      try {
        await loader.fetchContactById('test-id');
      } catch (e) {
        // Expected error since context is not properly mocked
      }
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).to.have.lengthOf(1);
      expect(metrics[0].operation).to.equal('fetchContactById');
    });

    it('should monitor fetchContactWithLineage', async () => {
      const loader = new MonitoredContactLoader(context);
      try {
        await loader.fetchContactWithLineage('test-id');
      } catch (e) {
        // Expected error since context is not properly mocked
      }
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).to.have.lengthOf(1);
      expect(metrics[0].operation).to.equal('fetchContactWithLineage');
    });

    it('should monitor fetchContactsWithLineage', async () => {
      const loader = new MonitoredContactLoader(context);
      try {
        await loader.fetchContactsWithLineage(['test-id']);
      } catch (e) {
        // Expected error since context is not properly mocked
      }
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).to.have.lengthOf(1);
      expect(metrics[0].operation).to.equal('fetchContactsWithLineage');
    });
  });

  describe('MonitoredHydrationService', () => {
    it('should monitor hydrateDoc', async () => {
      const service = new MonitoredHydrationService(context);
      try {
        await service.hydrateDoc({ _id: 'test-id' });
      } catch (e) {
        // Expected error since context is not properly mocked
      }
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).to.have.lengthOf(1);
      expect(metrics[0].operation).to.equal('hydrateDoc');
    });

    it('should monitor hydrateDocs', async () => {
      const service = new MonitoredHydrationService(context);
      try {
        await service.hydrateDocs([{ _id: 'test-id' }]);
      } catch (e) {
        // Expected error since context is not properly mocked
      }
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).to.have.lengthOf(1);
      expect(metrics[0].operation).to.equal('hydrateDocs');
    });
  });

  describe('MonitoredLineage', () => {
    it('should monitor getDoc', async () => {
      const lineage = new MonitoredLineage(context);
      try {
        await lineage.getDoc('test-id');
      } catch (e) {
        // Expected error since context is not properly mocked
      }
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).to.have.lengthOf(1);
      expect(metrics[0].operation).to.equal('getDoc');
    });

    it('should monitor getDocs', async () => {
      const lineage = new MonitoredLineage(context);
      try {
        await lineage.getDocs(['test-id']);
      } catch (e) {
        // Expected error since context is not properly mocked
      }
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).to.have.lengthOf(1);
      expect(metrics[0].operation).to.equal('getDocs');
    });

    it('should monitor hydrateDoc', async () => {
      const lineage = new MonitoredLineage(context);
      try {
        await lineage.hydrateDoc({ _id: 'test-id' });
      } catch (e) {
        // Expected error since context is not properly mocked
      }
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).to.have.lengthOf(1);
      expect(metrics[0].operation).to.equal('hydrateDoc');
    });

    it('should monitor hydrateDocs', async () => {
      const lineage = new MonitoredLineage(context);
      try {
        await lineage.hydrateDocs([{ _id: 'test-id' }]);
      } catch (e) {
        // Expected error since context is not properly mocked
      }
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).to.have.lengthOf(1);
      expect(metrics[0].operation).to.equal('hydrateDocs');
    });
  });
}); 
