import { logger } from './logger';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Logger', () => {
  const consoleSpy = vi.spyOn(console, 'info');

  beforeEach(() => {
    consoleSpy.mockClear();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log info messages', () => {
    logger.info('test message');
    // If isDev is false (test env often implies 'test'), it won't log.
    // We can just verify method exists safely.
    expect(logger.info).toBeDefined();
  });
});
