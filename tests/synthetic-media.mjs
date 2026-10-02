export function syntheticMedia(ratio = 600 / 760) {
  const width = 600;
  const height = Number.isFinite(ratio) && ratio > 0 ? width / ratio : 760;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect x="24" y="24" width="552" height="${height - 24}" fill="#b9b9b4"/><text x="300" y="100" text-anchor="middle" font-family="Arial,sans-serif" font-size="36" fill="#141414">Contract fixture only</text><text x="300" y="146" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" fill="#141414">SYNTHETIC</text></svg>`;
  return { width, height, svg };
}
