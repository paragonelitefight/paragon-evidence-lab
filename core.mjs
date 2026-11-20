// Local Node acceptance candidate. Never sends network requests or deploys.
import assert from 'node:assert/strict';
import {webcrypto,createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const checks=[];
const run=async(name,fn)=>{await fn();checks.push({name,status:'passed'});console.log('PASS',name);};
const hash=b=>createHash('sha256').update(b).digest('hex');
await mkdir('acceptance/results',{recursive:true});
await run('Original timestamp input and receipt preserved',async()=>{
 assert.equal(hash(await readFile('evidence/public-shipping-summary.txt')),'c143c226647fbfbf5b90945b14ad137f09f8bab78eb58223594566391bcc4a26');
 assert.equal(hash(await readFile('evidence/public-shipping-summary.txt.ots')),'72d44c9aa5c6f4b53e26a346396ae30595b9f961baf646f7f206d267ae4ca3a0');
});
await run('Two local Worker assemblies byte-identical',async()=>{
 execFileSync(process.execPath,['build/worker-integrated-pack.mjs'],{stdio:'inherit'});
 const first=await readFile('dist/paragon-evidence-worker.mjs');
 execFileSync(process.execPath,['build/worker-integrated-pack.mjs'],{stdio:'inherit'});
 assert.deepEqual(await readFile('dist/paragon-evidence-worker.mjs'),first);
});
execFileSync(process.execPath,['--check','dist/paragon-evidence-worker.mjs'],{stdio:'inherit'});
const {default:worker}=await import('../dist/paragon-evidence-worker.mjs');
const call=(path,env={},method='GET')=>worker.fetch(new Request('https://isolated.invalid'+path,{method}),env);
await run('Read-only routes and PDF smoke checks',async()=>{
 for(const path of ['/health','/api/capabilities','/api/protocol-status','/api/integration-status','/api/capsule','/research','/source/catalog.json']){
  const response=await call(path);assert.equal(response.status,200,path);await response.text();
 }
 const pdf=await call('/public-evidence-summary.pdf');assert.equal(pdf.status,200);assert.match(pdf.headers.get('content-type'),/application\/pdf/);assert.ok((await pdf.text()).startsWith('%PDF-'));
 assert.equal((await call('/health',{},'POST')).status,405);
 assert.equal((await call('/ask?query=company&mode=list&streaming=false')).status,503);
});
await run('Missing signer fails closed and protocols remain non-authorizing',async()=>{
 assert.equal((await call('/api/http-signed-evidence')).status,503);
 const status=await(await call('/api/protocol-status')).json();
 assert.equal(status.ap2.paymentsEnabled,false);assert.equal(status.ap2.fullMandateVerifier,false);
 assert.equal(status.anp.enabled,false);assert.equal(status.tee.enabled,false);
});
await run('ML-DSA65 detached signature and tamper rejection',async()=>{
 const {ml_dsa65}=await import('../worker/vendor/ml-dsa.mjs');
 const {publicKey,secretKey}=ml_dsa65.keygen();
 try{const data=new TextEncoder().encode('PARAGON_SYNTHETIC_ACCEPTANCE_ONLY');const signature=ml_dsa65.sign(data,secretKey);assert.equal(ml_dsa65.verify(signature,data,publicKey),true);const changed=data.slice();changed[0]^=1;assert.equal(ml_dsa65.verify(signature,changed,publicKey),false);}finally{secretKey.fill(0);}
});
await run('Local WBA candidate signature and changed-path rejection',async()=>{
 const {createWebBotAuthHeaders}=await import('../protocols/web-bot-auth-request.mjs');
 const keys=await crypto.subtle.generateKey('Ed25519',true,['sign','verify']);
 const privateJwk=await crypto.subtle.exportKey('jwk',keys.privateKey);
 const result=await createWebBotAuthHeaders({url:'https://isolated.invalid/probe?q=1',directoryUrl:'https://isolated.invalid/.well-known/http-message-signatures-directory',privateJwk});
 const params=result.headers['Signature-Input'].slice(5);
 const base='"@method": GET\n"@authority": isolated.invalid\n"@path": /probe\n"@query": ?q=1\n"signature-agent": '+result.headers['Signature-Agent']+'\n"@signature-params": '+params;
 const signature=Buffer.from(result.headers.Signature.slice(6,-1),'base64');
 assert.equal(await crypto.subtle.verify('Ed25519',keys.publicKey,signature,new TextEncoder().encode(base)),true);
 assert.equal(await crypto.subtle.verify('Ed25519',keys.publicKey,signature,new TextEncoder().encode(base.replace('/probe','/changed'))),false);
 await assert.rejects(createWebBotAuthHeaders({url:'http://isolated.invalid/',directoryUrl:'https://isolated.invalid/keys',privateJwk}));
});
await run('Checkout JWT candidate valid binding and bad-input rejection',async()=>{
 const {inspectSignedCheckoutJwt}=await import('../protocols/ap2-jwt-binding-inspector.mjs');
 const keys=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
 const publicJwk=await crypto.subtle.exportKey('jwk',keys.publicKey);
 const b64=x=>Buffer.from(x).toString('base64url');
 const body=b64(JSON.stringify({alg:'ES256'}))+'.'+b64(JSON.stringify({iss:'synthetic-merchant',exp:2000,iat:900}));
 const sig=await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},keys.privateKey,new TextEncoder().encode(body));
 const jwt=body+'.'+b64(sig);const args={jwt,trustedMerchantJwk:publicJwk,expectedIssuer:'synthetic-merchant',expectedCheckoutHash:createHash('sha256').update(jwt).digest('base64url'),nowSeconds:1000};
 const result=await inspectSignedCheckoutJwt(args);assert.equal(result.authorizedToPurchase,false);assert.equal(result.fullAp2Verified,false);
 await assert.rejects(inspectSignedCheckoutJwt({...args,nowSeconds:2000}));
 await assert.rejects(inspectSignedCheckoutJwt({...args,expectedIssuer:'wrong'}));
 await assert.rejects(inspectSignedCheckoutJwt({...args,expectedCheckoutHash:'wrong'}));
 await assert.rejects(inspectSignedCheckoutJwt({...args,jwt:jwt+'~'}));
});
execFileSync(process.execPath,['pir/test.mjs'],{stdio:'inherit'});
await writeFile('acceptance/results/core.json',JSON.stringify({format:'paragon-acceptance/1',checks,workerSha256:hash(await readFile('dist/paragon-evidence-worker.mjs')),scope:'Local Node tests only. Not browser, Cloudflare runtime, independent build, registered WBA, full AP2/ANP, carrier proof or Bitcoin consensus verification.'},null,2)+'\n');
console.log('CORE COMPLETE; see explicit scope in acceptance/results/core.json');
