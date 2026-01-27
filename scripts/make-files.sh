#!/usr/bin/env bash

FOLDER=apps/file-api/src/assets

extensions=( png webp jpg jpeg mp4 mp3 wav mkv json json5 md txt xml)

FILE_SIZE="1m"

# ensure assets folder exists
mkdir -p "$FOLDER"

# helper to create a file of a given size. Prefer mkfile (macOS), fall back to fallocate or dd.
create_file() {
  local size=$1
  local dest=$2
  if command -v mkfile >/dev/null 2>&1; then
    mkfile "$size" "$dest"
  elif command -v fallocate >/dev/null 2>&1; then
    fallocate -l "$size" "$dest"
  else
    # dd expects a size in bytes; use bs=1M count to approximate megabytes
    # Accept sizes like 1m, 10m
    if echo "$size" | grep -qiE '^[0-9]+m$'; then
      local mb=$(echo "$size" | sed -E 's/m$//i')
      dd if=/dev/zero of="$dest" bs=1M count="$mb" status=none
    else
      # fallback: create an empty file
      : > "$dest"
    fi
  fi
}

for val in "${extensions[@]}"
do
  FILE_PATH="$FOLDER/generated_file.$val"
  if [ ! -f "$FILE_PATH" ]; then
    create_file "$FILE_SIZE" "$FILE_PATH"
  fi
done

# Ensure we have a jpg roadsign test asset (some tooling expects .jpg)
if [ ! -f "$FOLDER/scuba-test-image.jpeg" ]; then
  if [ -f "$FOLDER/scuba-test-image.png" ]; then
    # macOS has sips; ImageMagick has convert
    if command -v sips >/dev/null 2>&1; then
      sips -s format jpeg "$FOLDER/scuba-test-image.png" --out "$FOLDER/scuba-test-image.jpeg" >/dev/null 2>&1 || true
    elif command -v convert >/dev/null 2>&1; then
      convert "$FOLDER/scuba-test-image.png" "$FOLDER/scuba-test-image.jpg" >/dev/null 2>&1 || true
    else
      # As a last resort, copy the png to .jpg (not a true jpeg but works for presence)
      cp "$FOLDER/scuba-test-image.png" "$FOLDER/scuba-test-image.jpg" || true
    fi
  fi
fi
