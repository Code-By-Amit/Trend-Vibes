import test from 'node:test';
import assert from 'node:assert/strict';
import { courierOrderStatus } from '../src/lib/order-rules.js';

test('failed delivery and return scans never mark a customer order delivered', () => {
  for (const scan of ['Undelivered', 'Not Delivered', 'RTO Delivered', 'Cancelled', 'Delivery Failed']) assert.equal(courierOrderStatus(scan, 'shipped'), null);
  assert.equal(courierOrderStatus('Delivered', 'shipped'), 'delivered');
  assert.equal(courierOrderStatus('Delivered', 'cancelled'), null);
  assert.equal(courierOrderStatus('In Transit', 'delivered'), null);
  assert.equal(courierOrderStatus('Manifested', 'packed'), null);
  assert.equal(courierOrderStatus('In Transit', 'packed'), 'shipped');
});
