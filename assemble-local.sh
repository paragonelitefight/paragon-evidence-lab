#!/usr/bin/env bash
# Assembly only, equivalent serialization ingredients to the Node recipe. Not a runtime test.
set -euo pipefail
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
: > "$work/entries.jsonl"
while IFS= read -r spec; do
  path="$(printf '%s' "$spec" | jq -r .path)"
  bytes="$(wc -c < "$path" | tr -d ' ')"
  hash="$(sha256sum "$path" | cut -d ' ' -f1)"
  if test "$(printf '%s' "$spec" | jq -r '.binary // false')" = true; then
    od -An -v -tx1 "$path" | tr -d ' \n' > "$work/hex"
    jq -cn --argjson s "$spec" --rawfile value "$work/hex" --arg hash "$hash" --argjson bytes "$bytes" '{route:$s.route,entry:({type:$s.type,hex:$value}+(if $s.filename then {filename:$s.filename} else {} end)),catalog:{route:$s.route,source:$s.path,bytes:$bytes,sha256:$hash}}' >> "$work/entries.jsonl"
  else
    jq -cn --argjson s "$spec" --rawfile value "$path" --arg hash "$hash" --argjson bytes "$bytes" '{route:$s.route,entry:({type:$s.type,text:$value}+(if $s.filename then {filename:$s.filename} else {} end)),catalog:{route:$s.route,source:$s.path,bytes:$bytes,sha256:$hash}}' >> "$work/entries.jsonl"
  fi
done < <(jq -c '.[]' build/integration-assets.json)
jq -s '[.[].catalog]' "$work/entries.jsonl" > "$work/catalog.json"
jq -c -n --slurpfile assets "$work/entries.jsonl" --slurpfile catalog "$work/catalog.json" 'reduce $assets[] as $a ({};.[$a.route]=$a.entry) | .["/source/catalog.json"]={type:"application/json; charset=utf-8",text:({edition:"0.12.0",sourceAssemblyOnly:true,testsExecuted:false,assets:$catalog[0]}|tojson)}' > "$work/assets.json"
mkdir -p dist
out=dist/paragon-evidence-worker.mjs
printf '/* Paragon Evidence Flight Recorder 0.12.0, browser-batch candidate. Not runtime-accepted. */\nconst BUNDLE_ASSETS = ' > "$out"
cat "$work/assets.json" >> "$out"
printf ';\n' >> "$out"
while IFS=' ' read -r name path; do
  printf 'const %s = ' "$name" >> "$out"
  jq -Rs . "$path" >> "$out"
  printf ';\n' >> "$out"
done <<'INGREDIENTS'
OTS_VENDOR worker/vendor/ots.js
OTS_LICENSE worker/vendor/ots-license.txt
PQ_VENDOR worker/vendor/ml-dsa.mjs
QR_VENDOR worker/vendor/qr.js
ADDITIONAL_LICENSES worker/vendor/additional-licenses.txt
SOURCE_MAIN worker/main.js
INGREDIENTS
cat worker/integration.js >> "$out"
printf '\n' >> "$out"
cat worker/main.js >> "$out"
sha256sum "$out"
