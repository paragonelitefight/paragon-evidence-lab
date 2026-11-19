// Deterministic Worker assembly recipe. Does not execute or deploy the Worker.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const ingredients=[['OTS_VENDOR','worker/vendor/ots.js'],['OTS_LICENSE','worker/vendor/ots-license.txt'],['PQ_VENDOR','worker/vendor/ml-dsa.mjs'],['QR_VENDOR','worker/vendor/qr.js'],['ADDITIONAL_LICENSES','worker/vendor/additional-licenses.txt'],['SOURCE_MAIN','worker/main.js']];
let output='/* Paragon Evidence Flight Recorder 0.10.0 — untested isolated candidate. */\n';
const manifest=[];
for(const [name,path] of ingredients){const bytes=await readFile(path);const source=bytes.toString('utf8');output+='const '+name+' = '+JSON.stringify(source)+';\n';manifest.push({path,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}
output+=await readFile('worker/main.js','utf8');
await mkdir('dist',{recursive:true});
await writeFile('dist/paragon-evidence-worker.mjs',output);
await writeFile('dist/worker-ingredients.json',JSON.stringify({format:'paragon-worker-source-assembly/0.1',edition:'0.10.0',ingredients:manifest,outputSha256:createHash('sha256').update(output).digest('hex'),independentlyReproduced:false,testsRun:false},null,2)+'\n');
console.log('Worker source assembled only. No deployment, tests or independent reproducibility certification.');
