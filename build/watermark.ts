import { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

type Opts = {
  metaPrefix?: string; // name prefix for injected meta tags
  saltEnvVar?: string; // env var name to use as salt
  commentPrefix?: string; // comment label for the final hash
};

function sha512Hex(input: string) {
  return crypto.createHash('sha512').update(input, 'utf8').digest('hex');
}

function sha256Hex(input: Buffer | string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

// deterministic obfuscation of a piece to make assembly "non-obvious"
// still deterministic so the same build inputs => same watermark
function obfuscate(piece: string, idx: number) {
  if (!piece) return '';
  // reverse every piece, take a slice skipping idx chars, then take chars at odd indexes
  const rev = piece.split('').reverse().join('');
  const start = idx % Math.max(1, Math.min(6, rev.length));
  const sliced = rev.slice(start, start + Math.max(4, Math.min(12, rev.length - start)));
  // take chars at odd positions to further tangle
  return sliced.split('').filter((_, i) => i % 2 === 1).join('');
}

export function watermark(opts: Opts = {}): Plugin {
  const metaPrefix = opts.metaPrefix ?? 'wm';
  const saltEnvVar = opts.saltEnvVar ?? 'WATERMARK_SALT';
  const commentPrefix = opts.commentPrefix ?? 'watermark';

  return {
    name: 'watermark',
    apply: 'build',
    async generateBundle(_, bundle) {
      // 1) collect pieces that will be embedded in final HTML
      let pkgVersion = '';
      try {
        const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'));
        pkgVersion = String(pkg.version ?? '');
      } catch (e) {
        pkgVersion = '';
      }

      const buildTime = new Date().toISOString();
      const salt = String(process.env[saltEnvVar] ?? '');

      // fingerprint of JS/CSS assets contents (concatenate)
      const assetBuffers: Buffer[] = [];
      for (const fileName of Object.keys(bundle)) {
        const chunk = bundle[fileName] as any;
        // include emitted .js and .css assets (skip sourcemaps)
        if ((chunk.type === 'chunk' && /\.js($|\?)/.test(fileName)) || (chunk.type === 'asset' && /\.css($|\?)/.test(fileName))) {
          if (chunk.code) assetBuffers.push(Buffer.from(chunk.code));
          if (chunk.source && typeof chunk.source !== 'string') assetBuffers.push(Buffer.from(chunk.source));
          if (chunk.source && typeof chunk.source === 'string') assetBuffers.push(Buffer.from(chunk.source));
        }
      }
      const assetConcat = Buffer.concat(assetBuffers.length ? assetBuffers : [Buffer.from('')]);
      const assetFingerprint = sha256Hex(assetConcat).slice(0, 24); // short fingerprint

      // build nonce (keeps builds unique; still present in HTML)
      const nonce = crypto.randomBytes(6).toString('hex');

      // 2) create obfuscated assembly
      const pieces = [pkgVersion, buildTime, salt, assetFingerprint, nonce];
      const obfuscated = pieces.map((p, i) => obfuscate(String(p), i));
      // join in a slightly shuffled order (deterministic)
      const assemblyOrder = [2, 0, 4, 1, 3]; // indexes: salt, pkgVersion, nonce, buildTime, assetFingerprint
      const assembled = assemblyOrder.map(i => obfuscated[i]).join('::');

      // 3) compute final SHA-512
      const finalHash = sha512Hex(assembled);

      // 4) inject into index.html asset(s)
      for (const [fileName, file] of Object.entries(bundle)) {
        // find HTML assets (Vite outputs index.html as asset type 'asset')
        if ((file as any).type === 'asset' && /\.html($|\?)/.test(fileName)) {
          const htmlSource = typeof (file as any).source === 'string' ? (file as any).source : String((file as any).source);
          // build meta tags with original readable pieces (hidden) so they're present in final HTML
          const metaTags = [
            `<meta name="${metaPrefix}-v" content="${escapeHtml(pkgVersion)}">`,
            `<meta name="${metaPrefix}-t" content="${escapeHtml(buildTime)}">`,
            `<meta name="${metaPrefix}-s" content="${escapeHtml(salt)}">`,
            `<meta name="${metaPrefix}-f" content="${escapeHtml(assetFingerprint)}">`,
            `<meta name="${metaPrefix}-n" content="${escapeHtml(nonce)}">`,
            `<meta name="${metaPrefix}-sha512" content="${finalHash}">`
          ].join('\n    ');

          // insert the metas into the <head> (if present), else prefix
          let newHtml: string;
          if (/<head[^>]*>/i.test(htmlSource)) {
            newHtml = htmlSource.replace(/<head([^>]*)>/i, `<head$1>\n    <!-- ${commentPrefix}: pieces injected by vite-watermark -->\n    ${metaTags}`);
          } else {
            newHtml = `<!-- ${commentPrefix}: pieces injected by vite-watermark -->\n${metaTags}\n${htmlSource}`;
          }

          // also append a short comment with the final hash near the end of the file
          newHtml = newHtml.replace(/<\/body>/i, `\n    <!-- ${commentPrefix}:sha512=${finalHash} -->\n</body>`);

          // replace bundle asset
          (file as any).source = newHtml;
        }
      }
    }
  };
}

// small helper to escape attribute content
function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
