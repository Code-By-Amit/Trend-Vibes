import test from 'node:test';
import assert from 'node:assert/strict';
import { createOrderSchema } from '../src/lib/validations.js';

const base = { items: [{ productId: '00000000-0000-4000-8000-000000000001', quantity: 1 }] };

test('order API accepts COD and defaults to COD', () => {
  assert.equal(createOrderSchema.parse({ ...base, paymentMethod: 'cod' }).paymentMethod, 'cod');
  assert.equal(createOrderSchema.parse(base).paymentMethod, 'cod');
});

test('order API rejects online and WhatsApp methods', () => {
  for (const paymentMethod of ['razorpay', 'whatsapp', 'online']) {
    assert.equal(createOrderSchema.safeParse({ ...base, paymentMethod }).success, false);
  }
});
