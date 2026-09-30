// Fixed review target. Require pushed source and a complete archive before any upload.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';

const root=resolve(import.meta.dirname,'..');
process.chdir(root);
const run=(command,args,options={})=>execFileSync(command,args,{encoding:'utf8',maxBuffer:16*1024*1024,...options});
assert.equal(run('git',['branch','--show-current']).trim(),'build/vertical-slice');
assert.equal(run('git',['remote','get-url','origin']).trim(),'https://github.com/between-two-suns/storefront.git');
run('git',['diff','--exit-code']);run('git',['diff','--cached','--exit-code']);
const sha=run('git',['rev-parse','HEAD']).trim();
const remote=run('git',['ls-remote','origin','refs/heads/build/vertical-slice']).split(/\s/)[0];
assert.equal(sha,remote,'Push and verify exact GitHub commit first');
const cli=join(root,'node_modules/.bin/shopify');
const themes=JSON.parse(run(cli,['theme','list','--store','qfj1gi-c9.myshopify.com','--json']));
assert.ok(themes.some(t=>t.id===166903251202&&t.role==='unpublished'));
assert.ok(themes.some(t=>t.id===166832668930&&t.role==='live'));
const directory=mkdtempSync(join(tmpdir(),'bts-v12-verified-'));
const archive=join(directory,'source.tar'), path=join(directory,'source');mkdirSync(path);
run('git',['archive',sha,'--output',archive]);run('tar',['-xf',archive,'-C',path]);
const files=run('git',['ls-tree','-r','--name-only',sha]).trim().split('\n');
for (const file of files) assert.deepEqual(readFileSync(join(path,file)),run('git',['show',`${sha}:${file}`],{encoding:null}),`Export bytes: ${file}`);
for (const file of ['.shopifyignore','layout/theme.liquid','templates/index.json','config/settings_data.json','assets/bts-home.css']) assert.ok(existsSync(join(path,file)),file);
const receipt={sha,remote,path,filesVerified:files.length,themes,verifiedAt:new Date().toISOString()};
const evidence=join(root,'test-results/v12-recovery');mkdirSync(evidence,{recursive:true});
writeFileSync(join(evidence,`github-before-deploy-${sha}.json`),JSON.stringify(receipt,null,2));
// Recheck immediately before upload; no empty or unverified directory reaches the CLI.
assert.equal(run('git',['ls-remote','origin','refs/heads/build/vertical-slice']).split(/\s/)[0],sha);
const output=run(cli,['theme','push','--store','qfj1gi-c9.myshopify.com','--theme','166903251202','--path',path,'--strict','--json']);
writeFileSync(join(evidence,`deploy-${sha}.jsonl`),output);
const result=JSON.parse(output.trim().split('\n').at(-1));
assert.equal(result.theme.id,166903251202);assert.equal(result.theme.role,'unpublished');assert.ok(!result.theme.errors);
console.log(JSON.stringify({...receipt,deployedAt:new Date().toISOString(),theme:result.theme}));
