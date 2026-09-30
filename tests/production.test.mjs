import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { renderFixture } from './render-fixture.mjs';
const readJSON = async path => JSON.parse(await readFile(new URL('../' + path, import.meta.url), 'utf8'));
const fixture = await readJSON('tests/fixtures/reviews.json');

test('production reviews remain empty and hide the empty EN/AR module without social proof', async () => {
  assert.equal(fixture.internal_fixture_only, true);
  assert.deepEqual((await readJSON('data/content/reviews/seed.json')).entries, []);
  for (const locale of ['en', 'ar']) {
    const html = await renderFixture({ surface: 'pdp', locale });
    assert.doesNotMatch(html, /class="bts-reviews"|bts-reviews__empty/);
    assert.doesNotMatch(html, /bts-reviews__summary|bts-reviews__list|aggregateRating|INTERNAL FIXTURE/);
  }
});

test('local-only review contract fixture renders computed snapshot rating and escapes text in each locale', async () => {
  for (const locale of ['en', 'ar']) {
    const html = await renderFixture({ surface: 'pdp', locale, reviewFeed: fixture.feed });
    assert.match(html, /bts-reviews__summary/);
    assert.match(html, /4\.2/);
    assert.equal((html.match(/class="bts-reviews__item"/g) || []).length, 5);
    assert.match(html, /INTERNAL FIXTURE/);
    assert.match(html, /&lt;script&gt;unsafe&lt;\/script&gt;/);
    assert.doesNotMatch(html, /<script>unsafe|aggregateRating/);
  }
});

test('review gate rejects fixtures, wrong product, invalid ratings, missing provenance, duplicates and unapproved copy', async () => {
  const edits = [
    feed => { feed.records.pop(); },
    feed => { feed.records = Array.from({ length: 51 }, (_, i) => ({ ...feed.records[0], id: String(i) })); },
    feed => { feed.fixture = true; },
    feed => { feed.approved = false; },
    feed => { feed.provider = ''; },
    feed => { feed.authenticity = 'unverified'; },
    feed => { feed.product_handle = 'clarity-serum'; },
    feed => { feed.records[0].id = feed.records[1].id; },
    feed => { feed.records[0].fixture = true; },
    feed => { feed.records[0].verified_purchase = false; },
    feed => { feed.records[0].published = false; },
    feed => { feed.records[0].approved = false; },
    feed => { feed.records[0].product_handle = 'clarity-serum'; },
    feed => { feed.records[0].rating = 6; },
    feed => { feed.records[0].rating = 0; },
    feed => { feed.records[0].rating = 3.5; },
    feed => { feed.records[0].rating = '4'; },
    feed => { feed.records[0].body.approved.en = false; },
    feed => { feed.records[0].display_name.en = ''; }
  ];
  for (const edit of edits) {
    const feed = structuredClone(fixture.feed); edit(feed);
    const html = await renderFixture({ surface: 'pdp', reviewFeed: feed });
    assert.doesNotMatch(html, /class="bts-reviews"|bts-reviews__empty/);
    assert.doesNotMatch(html, /bts-reviews__summary|bts-reviews__list|INTERNAL FIXTURE/);
  }
  const feed = structuredClone(fixture.feed); feed.records[0].body.approved.ar = false;
  const html = await renderFixture({ surface: 'pdp', locale: 'ar', reviewFeed: feed });
  assert.doesNotMatch(html, /class="bts-reviews"|bts-reviews__empty/);
  assert.doesNotMatch(html, /NOT A CUSTOMER REVIEW/);
});

test('H1 manifest preserves sourced heights, final-only null media, exact originals and matte shared pumps', async () => {
  const manifest = await readJSON('data/production/h1-manifest.json');
  assert.deepEqual(manifest.assets.map(a => a.pack_height_mm).sort((a, b) => a - b), [96, 116, 116, 180]);
  for (const asset of manifest.assets) {
    const seed = await readJSON('data/content/products/' + asset.product_handle + '.json');
    assert.equal(asset.pack_height_mm, seed.fields.pack_height_mm);
    assert.equal(asset.pack_height_source, seed.fields.pack_height_source);
    assert.equal(seed.fields.media_front, null);
    assert.equal(asset.h1.file, null);
    assert.equal(asset.h1.approved, false);
    assert.equal(asset.h1.pack_crop_approved, false);
    assert.equal(asset.h1.height_px, 2400);
    assert.equal(asset.h1.width_px, null);
    assert.equal(asset.h1.filename, asset.product_handle + '-H1-FINAL-v5.webp');
    assert.equal(asset.label_version, 'FINAL-v5');
    if (asset.pack_height_mm === 116) assert.equal(asset.pump_actuator_finish, 'MATTE');
  }
  const run = spawnSync(process.execPath, ['scripts/prepare-h1-integration.mjs', '--dry-run'], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  const plan = JSON.parse(run.stdout);
  assert.equal(plan.admin_calls, 0);
  assert.equal(plan.uploads, 0);
  assert.equal(plan.writes, 0);
  assert.equal(plan.all_four_ready, false);
  assert.ok(plan.plan.every(item => item.blockers.length > 0 && !item.media_entry_plan));
  const denied = spawnSync(process.execPath, ['scripts/prepare-h1-integration.mjs', '--upload'], { encoding: 'utf8' });
  assert.notEqual(denied.status, 0);
});

test('Arabic worksheet is source-grounded, wholly unapproved and excluded from content seeding', async () => {
  const draft = await readJSON('data/translation-drafts/ar-final-v5.json');
  const source = await readFile(new URL('../' + draft.source, import.meta.url), 'utf8');
  assert.equal(draft.source_sha256, createHash('sha256').update(source).digest('hex'));
  assert.equal(draft.customer_facing_approved, false);
  assert.equal(draft.production_import_allowed, false);
  for (const row of draft.rows) {
    assert.equal(row.customer_facing_approved, false);
    assert.equal(row.native_reviewer, null);
    assert.equal(row.regulatory_reviewer, null);
    if (row.source_en !== null) assert.ok(source.includes(row.source_en), row.field + ' exact English source');
    if (['name', 'inci', 'hero_actives', 'size_display'].includes(row.field)) assert.equal(row.draft_ar, row.source_en);
  }
  const clarity = draft.rows.filter(row => row.product_handle === 'clarity-serum');
  assert.equal(clarity.find(row => row.field === 'suitability').draft_ar, null);
  assert.equal(clarity.filter(row => row.field.startsWith('claims.')).length, 0);
  const run = spawnSync(process.execPath, ['scripts/seed-metaobjects.mjs', '--dry-run'], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  const plan = JSON.parse(run.stdout);
  assert.deepEqual(plan.proposed_reviews, []);
  for (const product of plan.proposed_products) {
    for (const field of product.fields) {
      if (plan.proposed_definition.fields[field.key] === 'json') {
        const value = JSON.parse(field.value);
        if (value?.approved?.ar !== undefined) assert.equal(value.approved.ar, false);
      }
    }
  }
});

test('H1 handoff rejects a legacy PNG renamed to the exact future WebP delivery filename', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'bts-h1-rejection-'));
  try {
    const manifest = await readJSON('data/production/h1-manifest.json');
    const filename = manifest.assets[0].h1.filename;
    const oldBytes = await readFile(new URL('../opus-brand-pack/products/01-daily-reset-cleanser.webp', import.meta.url));
    await writeFile(join(directory, filename), oldBytes);
    const run = spawnSync(process.execPath, ['scripts/prepare-h1-integration.mjs', '--dry-run', '--delivery', directory], { encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr);
    const plan = JSON.parse(run.stdout);
    const cleanser = plan.plan.find(item => item.filename === filename);
    assert.equal(plan.admin_calls, 0);
    assert.equal(cleanser.ready_for_later_authorized_integration, false);
    assert.ok(cleanser.blockers.includes('Not genuine WebP'));
    assert.equal(cleanser.media_entry_plan, undefined);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
