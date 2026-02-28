#!/bin/bash
# Generate Keystatic gallery YAML entries from converted images in public/images/gallery/
# Run this after convert-images.sh, or if you manually added images to public/images/gallery/
#
# Filename convention: <artist>-<style>-NNN.jpg
# Examples:
#   rocio-fineline-001.jpg       -> artist=rocio, style=fineline
#   adri-pinto-microrealismo-042.jpg -> artist=adri-pinto, style=microrealismo

set -euo pipefail

OUTPUT_DIR="public/images/gallery"
GALLERY_DIR="src/content/gallery"

# Known styles (must match keystatic.config.ts STYLES)
KNOWN_STYLES="fineline|realismo|color|blackwork|composicion|freehand|mascotas|florales|microrealismo|curados|general"

if [ ! -d "$OUTPUT_DIR" ]; then
  echo "Error: $OUTPUT_DIR does not exist. Run convert-images.sh first."
  exit 1
fi

mkdir -p "$GALLERY_DIR"

# Clear existing gallery entries
rm -f "$GALLERY_DIR"/*.yaml

count=0
for img in "$OUTPUT_DIR"/*.jpg; do
  [ -f "$img" ] || continue

  name=$(basename "$img" .jpg)
  # Strip the trailing -NNN number
  prefix=$(echo "$name" | sed 's/-[0-9]\{3\}$//')
  # Extract style: the last segment that matches a known style
  style=$(echo "$prefix" | grep -oE "(${KNOWN_STYLES})$" || echo "general")
  # Extract artist: everything before -<style>
  artist=$(echo "$prefix" | sed "s/-${style}$//")

  cat > "$GALLERY_DIR/${name}.yaml" << YAML
title: $name
image: /images/gallery/${name}.jpg
artist: $artist
style: $style
featured: false
YAML

  count=$((count + 1))
done

# Mark 8 as featured (2 per artist for diversity)
featured_count=0
for artist in rocio aranega adri-pinto fran; do
  artist_count=0
  for f in "$GALLERY_DIR"/${artist}-*.yaml; do
    [ -f "$f" ] || continue
    if [ $artist_count -lt 2 ]; then
      sed -i 's/featured: false/featured: true/' "$f"
      artist_count=$((artist_count + 1))
      featured_count=$((featured_count + 1))
    else
      break
    fi
  done
done

echo "Generated $count gallery entries in $GALLERY_DIR/"
echo "First $featured_count entries marked as featured."
