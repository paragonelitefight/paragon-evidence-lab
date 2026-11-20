/* Read-only integration layer. No fetch, cron, billing, payment or private-key storage. */
function flightAssetResponse(request) {
  const path = new URL(request.url).pathname;
  if (path === '/api/integration-status') return new Response(request.method === 'HEAD' ? null : JSON.stringify({edition:EDITION,sourceBundle:true,workerExecutedByAssistant:false,publicTimestamp:{summarySha256:'c143c226647fbfbf5b90945b14ad137f09f8bab78eb58223594566391bcc4a26',originalReceiptIncluded:true,inspection:BUNDLE_ASSETS['/evidence/receipt-inspection.json']?.text ? JSON.parse(BUNDLE_ASSETS['/evidence/receipt-inspection.json'].text) : null,observationTime:'2026-11-19T17:59:00+02:00',bitcoinVerified:false,automaticUpgrade:false},localBrowserTools:['AP2 narrow signed Checkout JWT inspection, not full AP2','Web Bot Auth experimental request construction, not registration or receiver authentication','synthetic local XOR PIR demonstration, not two independent operators'],externalExecutions:{zk:'source only; prover not executed',fhe:'source only; compiler and native library not executed',tla:'model source only; TLC not executed'},disabled:['full ANP authentication','full AP2 authorization and payment','incoming Web Bot Auth verification','TEE'],payments:false,storage:false,backgroundJobs:false,automaticExternalCalls:false,meaning:'Packaging is not activation or conformance. Included timestamp inspection is a dated local observation, not a live blockchain query.'},null,2),{headers:headers('application/json; charset=utf-8')});
  const asset=BUNDLE_ASSETS[path];
  if(!asset)return null;
  const body=asset.hex ? Uint8Array.from(asset.hex.match(/../g)||[], h=>parseInt(h,16)) : asset.text;
  const extra=asset.filename ? {'Content-Disposition':'attachment; filename="'+asset.filename+'"'} : {};
  return new Response(request.method==='HEAD'?null:body,{headers:{...headers(asset.type),...extra}});
}
