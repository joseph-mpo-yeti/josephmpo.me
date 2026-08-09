#!/usr/bin/env bash
#
# Regenerates the derivative media the site actually serves.
#
# The sources in assets/img are full-resolution captures (2880px screenshots and
# screen-recorded GIFs). Nothing on the page needs them at that size: the grid
# renders in a ~370px box and the lightbox tops out around 1200px. This script
# produces the sizes the page asks for and nothing else.
#
#   assets/img/thumbs/<name>-400.webp   grid preview, 1x
#   assets/img/thumbs/<name>-800.webp   grid preview, 2x
#   assets/img/thumbs/<name>-poster.webp  first frame of an animated preview
#   assets/video/<name>.mp4             animated preview / lightbox demo
#
# Re-runnable: outputs are skipped when they are newer than their source.
# Pass --force to rebuild everything.
#
# Requires: ImageMagick 7 (magick), ffmpeg with libx264.

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

IMG=assets/img
THUMBS=$IMG/thumbs
VIDEO=assets/video

FORCE=0
[[ "${1:-}" == "--force" ]] && FORCE=1

mkdir -p "$THUMBS" "$VIDEO"

# Skip work when the output already exists and is newer than its source.
#
# A missing source is not an error: the GIFs replaced by MP4 were removed once
# converted, so their entries below are inert unless the GIF is restored.
needs_build() {
  local src=$1 out=$2
  if [[ ! -f $src ]]; then
    [[ -f $out ]] || echo "  !! missing source and no output: $src" >&2
    return 1
  fi
  (( FORCE )) && return 0
  [[ -f $out && $out -nt $src ]] && return 1
  return 0
}

report() {
  printf '  %-52s %6s KB\n' "$1" "$(( $(stat -c %s "$1") / 1024 ))"
}

# --- Still grid previews -----------------------------------------------------
# Two widths so srcset can serve 1x and 2x for the same ~370px slot.
thumb() {
  local src=$1 name
  name=$(basename "${src%.*}")
  for w in 400 800; do
    local out=$THUMBS/$name-$w.webp
    if needs_build "$src" "$out"; then
      magick "$src" -resize "${w}x" -quality 80 -define webp:method=6 "$out"
      report "$out"
    fi
  done
}

# --- Animated previews and demos --------------------------------------------
# H.264 in MP4: every browser that matters plays it, and it is roughly two
# orders of magnitude smaller than the source GIF.
video() {
  local src=$1 width=$2 crf=$3 name=${4:-}
  [[ -z $name ]] && name=$(basename "${src%.*}")
  local out=$VIDEO/$name.mp4
  if needs_build "$src" "$out"; then
    ffmpeg -v error -y -i "$src" \
      -vf "scale=${width}:-2:flags=lanczos" \
      -c:v libx264 -crf "$crf" -preset slow -pix_fmt yuv420p \
      -an -movflags +faststart \
      "$out"
    report "$out"
  fi
}

# Poster frame, so the card shows something before the video decodes.
poster() {
  local src=$1 name
  name=$(basename "${src%.*}")
  local out=$THUMBS/$name-poster.webp
  if needs_build "$src" "$out"; then
    magick "${src}[0]" -resize 400x -quality 80 -define webp:method=6 "$out"
    report "$out"
  fi
}

echo "Still grid previews -> $THUMBS"
for f in \
  "$IMG/portfolio/english-step-by-step.png" \
  "$IMG/portfolio/netflix-with-elapsed-time.png" \
  "$IMG/portfolio/kalbasse.png" \
  "$IMG/portfolio/voices.png" \
  "$IMG/portfolio/news-scrapper.png" \
  "$IMG/portfolio/zimble.png" \
  "$IMG/portfolio/kalbasse-admin.png" \
  "$IMG/portfolio/copykod-screenshot.png" \
  "$IMG/portfolio/search.png" \
  "$IMG/portfolio/mi349_blog.png" \
  "$IMG/portfolio/mi349_card.png" \
  "$IMG/portfolio/mi349_soundboard.png" \
  "$IMG/portfolio/movies.png" \
  "$IMG/portfolio/mi349_final.png" \
  "$IMG/fcc/fcc-pomodoro.png" \
  "$IMG/fcc/fcc-drum.png" \
  "$IMG/fcc/fcc-md.png" \
  "$IMG/fcc/fcc-portfolio.png" \
  "$IMG/fcc/fcc-calculator.png" \
  "$IMG/fcc/fcc-tech-doc.png" \
; do thumb "$f"; done

echo "Animated grid previews -> $VIDEO (400w loop) + poster"
for f in \
  "$IMG/portfolio/simpletweet_1.gif" \
  "$IMG/portfolio/flashgram_2.gif" \
  "$IMG/portfolio/flixster_1.gif" \
; do
  poster "$f"
  video "$f" 400 28 "$(basename "${f%.*}")-loop"
done

echo "Lightbox demos -> $VIDEO (1200w)"
for f in \
  "$IMG/portfolio/faire_le_challenge.gif" \
  "$IMG/portfolio/news-scrapper.gif" \
  "$IMG/portfolio/zimble.gif" \
  "$IMG/portfolio/kalbasse-admin.gif" \
  "$IMG/portfolio/copyko-copy.gif" \
  "$IMG/portfolio/search.gif" \
  "$IMG/portfolio/movies.gif" \
  "$IMG/portfolio/flashgram.gif" \
  "$IMG/portfolio/flixster_3.gif" \
  "$IMG/portfolio/simpletweet_1.gif" \
  "$IMG/portfolio/simpletweet_2.gif" \
  "$IMG/portfolio/simpletweet_4.gif" \
; do
  [[ -f $f ]] || continue
  # Portrait phone recordings are ~500px wide already; never upscale.
  src_w=$(magick identify -format '%w' "${f}[0]")
  target=$(( src_w < 1200 ? src_w : 1200 ))
  video "$f" "$target" 26
done

echo
echo "Done. Totals:"
du -sh "$THUMBS" "$VIDEO"
