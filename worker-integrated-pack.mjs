// Source assembly only. Run from package root: node build/worker-integrated-pack.mjs
// No installations, tests, deployments, key generation or network operations.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const specs=JSON.parse(await readFile('build/integration-assets.json','utf8'));
const assets={};const catalog=[];
for(const item of specs){
 const bytes=await readFile(item.path);
 assets[item.route]={type:item.type,...(item.filename?{filename:item.filename}:{}),...(item.binary?{hex:bytes.toString('hex')}:{text:bytes.toString('utf8')})};
 catalog.push({route:item.route,source:item.path,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
assets['/source/catalog.json']={type:'application/json; charset=utf-8',text:JSON.stringify({edition:'0.12.0',sourceAssemblyOnly:true,testsExecuted:false,assets:catalog},null,2)};
const ingredients=[['OTS_VENDOR','worker/vendor/ots.js'],['OTS_LICENSE','worker/vendor/ots-license.txt'],['PQ_VENDOR','worker/vendor/ml-dsa.mjs'],['QR_VENDOR','worker/vendor/qr.js'],['ADDITIONAL_LICENSES','worker/vendor/additional-licenses.txt'],['SOURCE_MAIN','worker/main.js']];
let output='/* Paragon Evidence Flight Recorder 0.12.0 — isolated integrated candidate, not runtime-validated. */\n';
output+='const BUNDLE_ASSETS = '+JSON.stringify(assets)+';\n';
const manifest=[];
for(const [name,path] of ingredients){const bytes=await readFile(path);output+='const '+name+' = '+JSON.stringify(bytes.toString('utf8'))+';\n';manifest.push({path,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}
output+=await readFile('worker/integration.js','utf8');output+='\n';output+=await readFile('worker/main.js','utf8');
await mkdir('dist',{recursive:true});
await writeFile('dist/paragon-evidence-worker.mjs',output);
await writeFile('dist/worker-ingredients.json',JSON.stringify({format:'paragon-worker-source-assembly/0.2',edition:'0.12.0',ingredients:manifest,assets:catalog,outputSha256:createHash('sha256').update(output).digest('hex'),independentlyReproduced:false,testsRun:false},null,2)+'\n');
console.log('Integrated source assembly finished. Not a runtime test, independent reproduction or deployment.');
