// Version-qualified candidate based on the documented Noir beta.20 + bb.js pairing.
// Must actually execute before any proof-generation claim. Synthetic inputs only.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {Noir} from '@noir-lang/noir_js';
import * as bb from '@aztec/bb.js';
const circuit=JSON.parse(await readFile('zk/target/paragon_private_transit_predicate.json','utf8'));
const noir=new Noir(circuit);
const {witness}=await noir.execute({transit_hours:'48',limit_hours:'72'});
await assert.rejects(noir.execute({transit_hours:'73',limit_hours:'72'}));
await assert.rejects(noir.execute({transit_hours:'0',limit_hours:'0'}));
await assert.rejects(noir.execute({transit_hours:'1',limit_hours:'8761'}));
let backend;
try {
 if(typeof bb.UltraHonkBackend!=='function')throw new Error('Pinned backend does not export UltraHonkBackend; qualification failed');
 // Pinned backend.js takes a BackendOptions object, NOT a Barretenberg instance.
 // It creates and owns its API internally during generateProof/verifyProof.
 backend=new bb.UltraHonkBackend(circuit.bytecode,{threads:1});
 console.log('ZK: witness and invalid-input checks completed; backend configured with threads=1.');
 const proof=await backend.generateProof(witness);
 assert.equal(await backend.verifyProof(proof),true);
 assert.ok(proof.proof instanceof Uint8Array && proof.proof.length>0);
 const tampered={...proof,proof:proof.proof.slice()};tampered.proof[Math.floor(tampered.proof.length/2)]^=1;
 let accepted=false;try{accepted=await backend.verifyProof(tampered);}catch{}
 assert.equal(accepted,false,'Modified proof must not verify');
 await mkdir('acceptance/results',{recursive:true});
 await writeFile('acceptance/results/zk-proof.bin',proof.proof);
 await writeFile('acceptance/results/zk.json',JSON.stringify({status:'passed',synthetic:true,sourceAuthenticated:false,predicate:'hidden transit_hours <= public limit_hours with 1 <= limit_hours <= 8760',proofSha256:createHash('sha256').update(proof.proof).digest('hex'),publicInputs:proof.publicInputs,invalidWitnessRejected:true,tamperedProofRejected:true,scope:'One synthetic rule execution, not evidence of an actual shipment. No independent verifier party.'},null,2)+'\n');
 console.log('PASS: generated and verified one synthetic ZK proof; invalid witness and modified proof rejected.');
} finally {
 if(backend && typeof backend.destroy==='function')await backend.destroy();
 // backend.destroy() disposes the internally owned API; no separate API instance exists.
}
