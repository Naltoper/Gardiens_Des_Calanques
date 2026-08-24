#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export JAVA_HOME="${JAVA_HOME:-/home/roblof/bubblewrap-tools/jdk-17}"
export PATH="$JAVA_HOME/bin:$PATH"
PW_FILE="$ROOT/android-packages/.keystore-password"
if [[ ! -f "$PW_FILE" ]]; then
  echo "Missing $PW_FILE" >&2
  exit 1
fi
export BUBBLEWRAP_KEYSTORE_PASSWORD
export BUBBLEWRAP_KEY_PASSWORD
BUBBLEWRAP_KEYSTORE_PASSWORD="$(cat "$PW_FILE")"
BUBBLEWRAP_KEY_PASSWORD="$BUBBLEWRAP_KEYSTORE_PASSWORD"
cd "$ROOT/twa"
bubblewrap update --skipVersionUpgrade
bubblewrap build --skipPwaValidation
mkdir -p "$ROOT/android-packages"
cp -f app-release-signed.apk "$ROOT/android-packages/app-release-signed.apk"
cp -f app-release-bundle.aab "$ROOT/android-packages/app-release-bundle.aab"
echo "APK: $ROOT/android-packages/app-release-signed.apk"
echo "AAB: $ROOT/android-packages/app-release-bundle.aab"
