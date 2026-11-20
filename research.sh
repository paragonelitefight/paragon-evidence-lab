#!/usr/bin/env bash
# Manual standard-runner qualification only. No deployment, secrets, artifacts or cache.
set -euo pipefail
mode="${1:?choose tlc or fhe}"
root="$PWD"
mkdir -p acceptance/results
case "$mode" in
 tlc)
  command -v java
  curl --fail --location --proto '=https' --tlsv1.2 --max-time 120 -o "$RUNNER_TEMP/tla2tools.jar" https://github.com/tlaplus/tlaplus/releases/download/v1.7.4/tla2tools.jar
  sha256sum "$RUNNER_TEMP/tla2tools.jar" | tee acceptance/results/tlc-tool-sha256.txt
  # Recorded transport-fetched digest is NOT independently authenticated provenance.
  (cd formal && timeout 180 java -Xmx1024m -cp "$RUNNER_TEMP/tla2tools.jar" tlc2.TLC -workers 1 -config EvidenceStatus.cfg EvidenceStatus.tla) | tee acceptance/results/tlc.log
  grep -F 'Model checking completed. No error has been found.' acceptance/results/tlc.log
  echo 'PASS: finite status-policy model only, not verification of the JavaScript implementation.'
  ;;
 fhe)
  git clone --depth 1 --branch v1.4.1 --recurse-submodules --shallow-submodules https://github.com/openfheorg/openfhe-development.git "$RUNNER_TEMP/openfhe"
  git -C "$RUNNER_TEMP/openfhe" rev-parse HEAD | tee acceptance/results/openfhe-commit.txt
  cmake -S "$RUNNER_TEMP/openfhe" -B "$RUNNER_TEMP/openfhe-build" -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX="$RUNNER_TEMP/openfhe-install" -DBUILD_SHARED=ON -DBUILD_STATIC=OFF -DBUILD_UNITTESTS=OFF -DBUILD_EXAMPLES=OFF -DBUILD_BENCHMARKS=OFF -DWITH_OPENMP=OFF
  cmake --build "$RUNNER_TEMP/openfhe-build" --parallel 2
  cmake --install "$RUNNER_TEMP/openfhe-build"
  cmake -S fhe -B "$RUNNER_TEMP/paragon-fhe" -DCMAKE_PREFIX_PATH="$RUNNER_TEMP/openfhe-install"
  cmake --build "$RUNNER_TEMP/paragon-fhe" --parallel 2
  export LD_LIBRARY_PATH="$RUNNER_TEMP/openfhe-install/lib:${LD_LIBRARY_PATH:-}"
  timeout 300 "$RUNNER_TEMP/paragon-fhe/paragon_fhe" | tee acceptance/results/fhe.log
  grep -F 'Synthetic encrypted AND result: 0' acceptance/results/fhe.log
  echo 'PASS: synthetic encrypted AND only. No customer data, Worker-native FHE or source attestation.'
  ;;
 *) echo 'Unknown mode' >&2; exit 2;;
esac
