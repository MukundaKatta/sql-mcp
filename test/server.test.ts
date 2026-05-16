import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { format } from '../src/server.js';

test('formats a basic select', () => {
  const out = format('select id, name from users where age > 21 order by id');
  assert.match(out, /SELECT/);
  assert.match(out, /FROM/);
  assert.match(out, /WHERE/);
  assert.match(out, /ORDER BY/);
});

test('preserves case when uppercase=false', () => {
  const out = format('select 1', { uppercase: false });
  assert.match(out, /select/);
  assert.equal(out.includes('SELECT'), false);
});

test('dialect-specific syntax (postgres)', () => {
  const out = format('select id::int from users', { dialect: 'postgresql' });
  assert.match(out, /SELECT/);
});

test('handles JOIN clauses', () => {
  const out = format('select * from a join b on a.id = b.id');
  assert.match(out, /JOIN b/);
  assert.match(out, /ON/);
});

test('tab width is configurable', () => {
  const a = format('select id from users', { tab_width: 2 });
  const b = format('select id from users', { tab_width: 4 });
  // Same query different indent → output differs.
  assert.notEqual(a, b);
});
