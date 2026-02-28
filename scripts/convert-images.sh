#!/bin/bash
# Convert and optimize portfolio images for web + generate Keystatic gallery entries
# Requires: imagemagick (magick command)
#
# Processes JPG, JPEG, PNG, HEIC files from fotos/ into optimized JPGs.
# Skips: MOV, MP4 (videos), ARW (Sony RAW — too large/slow, needs manual processing)
# Output:
#   - public/images/gallery/<artist>-<style>-NNN.jpg  (optimized images)
#   - src/content/gallery/<artist>-<style>-NNN.yaml    (Keystatic entries)

set -euo pipefail

FOTOS_DIR="fotos"
OUTPUT_DIR="public/images/gallery"
GALLERY_DIR="src/content/gallery"

mkdir -p "$OUTPUT_DIR"
mkdir -p "$GALLERY_DIR"

counter=0
errors=0

process_file() {
  local f="$1"
  local artist="$2"
  local style="$3"

  counter=$((counter + 1))
  local name="${artist}-${style}-$(printf '%03d' $counter)"
  local imgfile="${name}.jpg"

  echo "[$counter] $f -> $imgfile"
  if ! magick "$f" -auto-orient -quality 82 -resize "1600x1600>" -strip "$OUTPUT_DIR/$imgfile" 2>/dev/null; then
    echo "  ERROR: Failed to convert $f"
    errors=$((errors + 1))
    rm -f "$OUTPUT_DIR/$imgfile"
    counter=$((counter - 1))
    return
  fi

  # Generate Keystatic gallery entry
  cat > "$GALLERY_DIR/${name}.yaml" << YAML
title: $name
image: /images/gallery/${imgfile}
artist: $artist
style: $style
featured: false
YAML
}

# -------------------------------------------------------------------
# Rocio — styles: Fineline, florales, Color, Freehand, Mascotas, Microrealismo, Curados
# Skip: Videos dir, ARW raw files
# -------------------------------------------------------------------
for style_dir in "$FOTOS_DIR/Rocio"/*/; do
  dirname=$(basename "$style_dir")
  # Skip Videos directory
  [[ "$dirname" == "Videos" ]] && continue

  style=$(echo "$dirname" | tr '[:upper:]' '[:lower:]')

  for f in "$style_dir"*; do
    [ -f "$f" ] || continue
    ext="${f##*.}"
    ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
    # Skip RAW and video files
    case "$ext_lower" in
      arw|mov|mp4) continue ;;
    esac
    process_file "$f" "rocio" "$style"
  done
done

# -------------------------------------------------------------------
# Aranega — Fotografía Tatuaje (note trailing space in dir name)
# Uses glob to handle the trailing space reliably
# -------------------------------------------------------------------
for f in "$FOTOS_DIR"/Aranega/Fotografía\ Tatuaje*/*; do
  [ -f "$f" ] || continue
  ext="${f##*.}"
  ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
  case "$ext_lower" in
    jpg|jpeg|png|heic) ;;
    *) continue ;;
  esac
  process_file "$f" "aranega" "general"
done

# -------------------------------------------------------------------
# Adri Pinto — styles: Composicion, Fineline, Micro (note trailing spaces in some dir names)
# Skip: NEU, Adri pinto_, Vídeo_
# -------------------------------------------------------------------
for style_dir in "$FOTOS_DIR/Adri pinto "/*/ ; do
  dirname=$(basename "$style_dir")
  # Skip non-portfolio dirs
  [[ "$dirname" == NEU* ]] && continue
  [[ "$dirname" == "Adri pinto_" ]] && continue
  [[ "$dirname" == *"deo"* ]] && continue
  [[ "$dirname" == *"ídeo"* ]] && continue

  style=$(echo "$dirname" | tr '[:upper:]' '[:lower:]' | tr -d ' ')
  # Map "Micro" dir to "microrealismo" Keystatic style
  [[ "$style" == "micro" ]] && style="microrealismo"

  for f in "$style_dir"*; do
    [ -f "$f" ] || continue
    ext="${f##*.}"
    ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
    case "$ext_lower" in
      jpg|jpeg|png|heic) ;;
      *) continue ;;
    esac
    process_file "$f" "adri-pinto" "$style"
  done
done

# -------------------------------------------------------------------
# Fran — Línea fina + Grabado, blackwork
# HEIC files + JPG files (skip MOV videos)
# -------------------------------------------------------------------

# Línea fina
fran_fineline="$FOTOS_DIR/Fran/Línea fina"
if [ -d "$fran_fineline" ]; then
  for f in "$fran_fineline"/*; do
    [ -f "$f" ] || continue
    ext="${f##*.}"
    ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
    case "$ext_lower" in
      jpg|jpeg|png|heic) ;;
      *) continue ;;
    esac
    process_file "$f" "fran" "fineline"
  done
fi

# Grabado, blackwork
fran_blackwork="$FOTOS_DIR/Fran/Grabado, blackwork"
if [ -d "$fran_blackwork" ]; then
  for f in "$fran_blackwork"/*; do
    [ -f "$f" ] || continue
    ext="${f##*.}"
    ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
    case "$ext_lower" in
      jpg|jpeg|png|heic) ;;
      *) continue ;;
    esac
    process_file "$f" "fran" "blackwork"
  done
fi

# -------------------------------------------------------------------
# Mark 8 gallery entries as featured (2 per artist for diversity)
# -------------------------------------------------------------------
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

echo ""
echo "============================================"
echo "Done! $counter images converted to $OUTPUT_DIR/"
echo "Gallery entries created in $GALLERY_DIR/"
echo "First $featured_count entries marked as featured."
[ $errors -gt 0 ] && echo "Errors: $errors files failed to convert"
echo "============================================"
