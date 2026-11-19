PARAGON COORDINATED CANDIDATE 0.10.0 — READ NEXT-STEPS.txt FIRST
The notes below describe the research subpackage only. The additional Worker and protocol-candidate sources are documented in NEXT-STEPS.txt. None of these new additions has been tested or deployed.

PARAGON ISOLATED RESEARCH EXTENSION — SOURCE CANDIDATE
Prepared 19 November 2026. No tests, builds, deployments, external submissions or paid resource creation performed.

These are additional source modules, NOT a completed or security-reviewed integrated product. Existing Workers, keys, Shopify and checkout are untouched. Use synthetic inputs only. Do not upload private documents, customer records or signing keys. This package is separate from the existing 0.9 Worker source.

Included:
1. Noir private transit-hours predicate source. Needs a compatible pinned Nargo and Barretenberg toolchain; none is bundled or version-qualified here. The prover inputs are invented demonstration values. An actual proof has NOT been generated. The predicate does not authenticate a Shopify or DHL record.
2. OpenFHE Boolean encrypted-computation source. Requires OpenFHE headers/libraries, CMake and a C++ compiler. Dependency/build environment not bundled or validated. No generated keys or ciphertexts are included.
3. Two-server XOR PIR algorithm and executable Node test file. The test has not run here. Information-theoretic query privacy assumes two NON-COLLUDING server operators with identical fixed-length databases, secure client randomness and confidential transports. Hosting both sides under one operator does NOT establish this privacy assumption. This package contains local algorithms only, NOT deployed PIR services.
4. Finite TLA+ status-policy model and TLC configuration. Not model-checked here; no proof of JavaScript implementation conformance.
5. Deterministic dependency-free research-source packing script with SHA-256 manifest. Not an independently reproduced build and not a build of the complete Worker.

No turnkey paid/cloud installation is required by these files. Software licensing does not guarantee free compute, storage or maintenance. Do not add billing details or paid services.

Not included: full NLWeb/ANP/AP2 adapters; completed Web Bot Auth registration or conformance verification; TEE infrastructure; authenticated Shopify/DHL attestations; actual OpenTimestamps submission or completed Bitcoin proof. These remain OPEN, not implicitly covered by this package.

Recommended next environment: a new isolated public GitHub repository, standard Linux GitHub-hosted runner only, manually approved execution, no credentials, no deploy permissions, no customer data. A workflow_dispatch-only GitHub Actions file is included for synthetic XOR PIR correctness and same-job deterministic research-source packaging checks. It does NOT build Noir/OpenFHE, run TLC, verify a full Worker build, or deploy. It has a five-minute timeout, read-only repository permissions, no credential persistence, no artifact upload or cache, and no paid runner selection. It has not been run. Hosting compute is free only under the documented standard-public-repository runner conditions. Do not run it in a private repository under an assumption of unlimited free usage.

Sources:
https://noir-lang.org/docs/getting_started_manually
https://github.com/openfheorg/openfhe-development
https://lamport.azurewebsites.net/tla/toolbox.html
https://reproducible-builds.org/docs/definition/

Third-party libraries are not redistributed in this package. Their licenses must be retained when adding them. No new license is granted here for the merchant's existing repositories or private documents.
