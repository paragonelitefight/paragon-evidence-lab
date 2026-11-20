PARAGON EVIDENCE FLIGHT RECORDER — INTEGRATED CANDIDATE 0.11.0

PRIMARY DELIVERABLE
The single file dist/paragon-evidence-worker.mjs includes the existing evidence verifier, vendor code and notices, a new /research browser workbench, local protocol helper sources, research execution sources and the original public OpenTimestamps input/receipt. It is also supplied as a standalone TXT for convenient copying. No separate Worker imports, storage bindings, scheduled jobs, payment methods or paid services are added by this source package.

WHAT WAS ACTUALLY DONE
Source assembly only. The original public summary and original 689-byte .ots were copied unchanged and their SHA-256 values checked against the originals. Before this release, a bounded local parser consumed the original receipt and computed its hash paths, finding three pending calendar attestations, not a Bitcoin block attestation. Three calendar upgrade GETs returned 404 at the earlier inspection. The bundled observation is historical, not a live blockchain status check. No new timestamp was submitted by this release.

NEW INTEGRATION
/research links to original timestamp downloads and the dated inspection, and provides browser-local AP2 narrow ES256 Checkout JWT inspection, ephemeral Web Bot Auth GET-header construction, and a synthetic local XOR PIR demonstration. These tools have not been executed in a browser by the assistant. AP2 inputs and the ephemeral private request-signing key are not sent to a server by this workbench. Constructing headers sends no request and does not configure any Worker secret. Both PIR server roles run in one browser: no noncollusion or remote privacy guarantee.
/api/integration-status describes the boundaries explicitly.
/source/catalog.json lists integrated asset hashes.
Research sources are downloadable under /research/zk, /research/fhe and /research/formal. The protocol modules are served under /protocols. The old verifier and existing features remain in the same Worker.

IMPORTANT: NOT EVERYTHING PROPOSED IS IMPLEMENTED
This is not full ANP, full AP2, active registered Web Bot Auth, an incoming request authentication/replay service, a TEE, a generated ZK proof, an executed FHE computation or a TLC verification result. Adding their source files does not run compilers, provers or model checkers. No interoperability, performance, deployment, full independent reproducibility or runtime security acceptance is established. No private customer/company originals, secrets or original PDF copies are included. The old model/source-packaging workflow has not been rerun or enlarged; its old success does not validate 0.11.0.

DO NOT CHANGE AN EXISTING PRODUCTION WORKER
No existing Worker, identity, checkout, cron, flag, key or store page was changed. Do not paste this into an old production service. This candidate needs review and isolated runtime acceptance before any deployment. No Cloudflare deployment was performed here.

REBUILD
From this package root with Node available:
  node build/worker-pack.mjs
This delegates to build/worker-integrated-pack.mjs and reads build/integration-assets.json. Assembly is deterministic by construction, but the Node recipe has not been executed and independently compared by the assistant. The delivered output was assembled using the same listed source serialization operations in the sandbox. A diagnostic request returned no feedback, which is NOT a lint/syntax/runtime pass. The output SHA-256 is recorded in dist/worker-ingredients.json. No new automatic workflow trigger was added.

COST
No service is provisioned or activated by assembling or downloading this source. Before any future external computation, verify the actual account's free plan, runner type, existing payment bindings and hard-stop controls. No-card assumptions are not billing verification. No TEE trial or paid API is authorized.

TIMESTAMP BYTES
Summary SHA-256: c143c226647fbfbf5b90945b14ad137f09f8bab78eb58223594566391bcc4a26
Original OTS SHA-256: 72d44c9aa5c6f4b53e26a346396ae30595b9f961baf646f7f206d267ae4ca3a0
Retain both originals unchanged. Public receipt integrity does not authenticate the historical shipping facts or constitute a business-quality certification.

LICENSING
Existing vendor notices remain attached. No new permission to reuse original merchant documents or company materials is granted by this package. Historical NEXT-STEPS.txt describes 0.10.0 and is explicitly superseded by this document.
