// Deterministic packaging of this research extension ONLY, not the full Worker.
// No network, credentials or deploy operations. Requires Node.js.
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const paths = ['README.txt','zk/Nargo.toml','zk/src/main.nr','zk/Prover.toml','fhe/main.cpp','pir/pir.mjs','pir/test.mjs','formal/EvidenceStatus.tla','formal/EvidenceStatus.cfg','build/pack.mjs','.github/workflows/manual-source-checks.yml'].sort();
const entries = [];
for (const path of paths) { const data = await readFile(path); entries.push({path,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex'),base64:data.toString('base64')}); }
const output = JSON.stringify({format:'paragon-research-source-package/0.1',scope:'Research extension source only; no claim of independently reproduced Worker build',entries},null,2)+'\n';
await writeFile('research-source-package.json',output);
console.log(createHash('sha256').update(output).digest('hex'));
