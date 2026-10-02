// Offline receipt validation and integration plan. No upload, token, Admin or data write.
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
const root = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const permitted = new Set(['--dry-run', '--delivery', '--receipt']);
let delivery = resolve(root, 'opus-brand-pack/production/media');
let receiptPath = null;
for (let i = 0; i < args.length; i++) {
  if (!permitted.has(args[i])) throw new Error('Offline dry-run only; unknown argument: ' + args[i]);
  if (args[i] === '--dry-run') continue;
  const flag = args[i];
  const value = args[++i];
  if (!value || value.startsWith('--')) throw new Error('Missing path for ' + flag);
  if (flag === '--delivery') delivery = resolve(value);
  else receiptPath = resolve(value);
}
const manifest = JSON.parse(await readFile(resolve(root, 'data/production/h1-manifest.json'), 'utf8'));
const receipts = receiptPath ? JSON.parse(await readFile(receiptPath, 'utf8')) : [];
if (!Array.isArray(receipts)) throw new Error('Receipt must be an array');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export function webpDimensions(bytes) {
  if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') throw new Error('Not genuine WebP');
  for (let at = 12; at + 8 <= bytes.length;) {
    const chunk = bytes.toString('ascii', at, at + 4);
    const size = bytes.readUInt32LE(at + 4);
    const start = at + 8;
    if (start + size > bytes.length) throw new Error('Truncated WebP');
    if (chunk === 'VP8X' && size >= 10) return { width: 1 + bytes.readUIntLE(start + 4, 3), height: 1 + bytes.readUIntLE(start + 7, 3) };
    if (chunk === 'VP8L' && size >= 5 && bytes[start] === 0x2f) {
      const bits = bytes.readUInt32LE(start + 1);
      return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
    }
    if (chunk === 'VP8 ' && size >= 10 && bytes.subarray(start + 3, start + 6).equals(Buffer.from([0x9d, 0x01, 0x2a]))) return { width: bytes.readUInt16LE(start + 6) & 0x3fff, height: bytes.readUInt16LE(start + 8) & 0x3fff };
    at = start + size + size % 2;
  }
  throw new Error('No WebP dimensions');
}
const plan = [];
for (const asset of manifest.assets) {
  const item = { product_handle: asset.product_handle, filename: asset.h1.filename, blockers: [], ready_for_later_authorized_integration: false };
  let bytes;
  try { bytes = await readFile(resolve(delivery, asset.h1.filename)); }
  catch (error) { if (error.code !== 'ENOENT') throw error; item.blockers.push('Create exact FINAL-v5 H1 file'); }
  const matchingReceipts = receipts.filter(r => r.product_handle === asset.product_handle);
  const receipt = matchingReceipts[0];
  if (matchingReceipts.length > 1) item.blockers.push('Duplicate approval receipts');
  if (!receipt) item.blockers.push('Supply independent artwork/material/crop approval receipt');
  let dimensions;
  if (bytes) {
    item.sha256 = digest(bytes);
    try {
      dimensions = webpDimensions(bytes);
      item.dimensions_px = dimensions;
      if (dimensions.height !== asset.h1.height_px || dimensions.width <= 0 || dimensions.width > dimensions.height) item.blockers.push('Require 2400 px-high portrait tight silhouette');
    } catch (error) { item.blockers.push(error.message); }
  }
  if (receipt) {
    if (receipt.label_version !== 'FINAL-v5' || receipt.filename !== asset.h1.filename || receipt.sha256 !== item.sha256) item.blockers.push('Receipt filename/version/hash mismatch');
    for (const signoff of ['label', 'physical_geometry', 'material', 'crop']) {
      const entry = receipt.signoffs?.[signoff];
      if (entry?.approved !== true || !entry.reviewer?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date || '')) item.blockers.push('Missing ' + signoff + ' signoff');
    }
    if (asset.pump_actuator_finish && receipt.pump_actuator_finish !== asset.pump_actuator_finish) item.blockers.push('MATTE pump/actuator not confirmed');
    if (receipt.pack_height_mm !== asset.pack_height_mm) item.blockers.push('Physical height mismatch');
    if (dimensions && JSON.stringify(receipt.silhouette_bbox_px) !== JSON.stringify([0, 0, dimensions.width - 1, dimensions.height - 1])) item.blockers.push('Silhouette must span all frame edges');
    if (dimensions && receipt.contact_row_px !== dimensions.height - 1) item.blockers.push('Contact point not on bottom edge');
    if (!receipt.artwork_path || !receipt.artwork_sha256) item.blockers.push('Missing exact final artwork source');
    else {
      try {
        const path = resolve(root, receipt.artwork_path);
        if (!path.startsWith(resolve(root, 'opus-brand-pack/production/artwork') + '/')) item.blockers.push('Artwork must be retained under opus-brand-pack/production/artwork');
        else if (digest(await readFile(path)) !== receipt.artwork_sha256) item.blockers.push('Artwork hash mismatch');
      } catch (error) { if (error.code !== 'ENOENT') throw error; item.blockers.push('Artwork source file absent'); }
    }
  }
  if (item.blockers.length === 0) {
    item.ready_for_later_authorized_integration = true;
    item.media_entry_plan = { type: 'bts_media', handle: asset.h1.target_media_handle, fields: { file: null, role: 'H1', product_handle: asset.product_handle, label_version: 'FINAL-v5', approved: true, pack_crop_approved: true, alt: asset.h1.alt } };
    item.content_link_plan = { handle: asset.product_handle, field: 'media_front', target_media_handle: asset.h1.target_media_handle };
    item.note = 'Real Files GID and media reference resolved only during later authorized integration; no reference invented here.';
  }
  plan.push(item);
}
console.log(JSON.stringify({ dry_run: true, admin_calls: 0, uploads: 0, writes: 0, all_four_ready: plan.every(p => p.ready_for_later_authorized_integration), plan }, null, 2));
