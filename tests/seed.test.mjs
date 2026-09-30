import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
const root=resolve(import.meta.dirname,'..');
test('offline seed emits exact mapped JSON envelopes and makes no Admin calls',()=>{
 const result=spawnSync(process.execPath,['scripts/seed-metaobjects.mjs','--dry-run'],{cwd:root,encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);const plan=JSON.parse(result.stdout);assert.equal(plan.admin_calls,0);assert.equal(plan.proposed_products.length,5);
 for(const entry of plan.proposed_products) for(const field of entry.fields) {
  assert.ok(field.key in plan.proposed_definition.fields);
  if(plan.proposed_definition.fields[field.key]==='json') JSON.parse(field.value);
 }
});
test('seed refuses any write flag without touching Admin',()=>{
 const result=spawnSync(process.execPath,['scripts/seed-metaobjects.mjs','--write'],{cwd:root,encoding:'utf8'});assert.equal(result.status,1);assert.match(result.stderr,/Dry-run only/);
});
