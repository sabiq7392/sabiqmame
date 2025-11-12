#!/bin/bash

# Script to optimize images to WebP format
# Usage: ./optimize-assets.sh <folder_path> [quality]
# Example: ./optimize-assets.sh public/my-gallery 85

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if folder path is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Folder path is required${NC}"
    echo "Usage: $0 <folder_path> [quality]"
    echo "Example: $0 public/my-gallery 85"
    exit 1
fi

FOLDER_PATH="$1"
QUALITY="${2:-85}" # Default quality 85 if not provided

# Check if folder exists
if [ ! -d "$FOLDER_PATH" ]; then
    echo -e "${RED}Error: Folder '$FOLDER_PATH' does not exist${NC}"
    exit 1
fi

# Check if imagemagick is installed
if ! command -v convert &> /dev/null && ! command -v magick &> /dev/null; then
    echo -e "${RED}Error: ImageMagick is not installed${NC}"
    echo "Install it with:"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu: sudo apt-get install imagemagick"
    echo "  Or use: brew install webp (for cwebp)"
    exit 1
fi

# Check if cwebp is available (preferred for WebP conversion)
if command -v cwebp &> /dev/null; then
    USE_CWEBP=true
    echo -e "${GREEN}Using cwebp for WebP conversion${NC}"
elif command -v convert &> /dev/null || command -v magick &> /dev/null; then
    USE_CWEBP=false
    echo -e "${YELLOW}Using ImageMagick for WebP conversion${NC}"
else
    echo -e "${RED}Error: No WebP conversion tool found${NC}"
    exit 1
fi

# Image extensions to process
IMAGE_EXTENSIONS=("jpg" "jpeg" "png" "heic" "heif" "gif" "bmp" "tiff" "tif")

echo -e "${BLUE}Starting optimization of images in: $FOLDER_PATH${NC}"
echo -e "${BLUE}Quality: $QUALITY${NC}"
echo ""

# Counters (using temp files to persist across subshells)
TEMP_DIR=$(mktemp -d)
TOTAL_FILE="$TEMP_DIR/total"
CONVERTED_FILE="$TEMP_DIR/converted"
SKIPPED_FILE="$TEMP_DIR/skipped"
FAILED_FILE="$TEMP_DIR/failed"

echo "0" > "$TOTAL_FILE"
echo "0" > "$CONVERTED_FILE"
echo "0" > "$SKIPPED_FILE"
echo "0" > "$FAILED_FILE"

# Function to increment counter
increment_counter() {
    local counter_file="$1"
    local current=$(cat "$counter_file")
    echo $((current + 1)) > "$counter_file"
}

# Function to convert image to WebP
convert_to_webp() {
    local file="$1"
    local file_dir=$(dirname "$file")
    local file_name=$(basename "$file")
    local file_name_no_ext="${file_name%.*}"
    local webp_file="$file_dir/$file_name_no_ext.webp"
    
    increment_counter "$TOTAL_FILE"
    
    # Skip if already WebP (case insensitive)
    file_name_lower=$(echo "$file_name" | tr '[:upper:]' '[:lower:]')
    if [[ "$file_name_lower" == *.webp ]]; then
        echo -e "${YELLOW}⏭️  Skipping (already WebP): $file${NC}"
        increment_counter "$SKIPPED_FILE"
        return 0
    fi
    
    # Skip if WebP version already exists
    if [ -f "$webp_file" ]; then
        echo -e "${YELLOW}⏭️  Skipping (WebP exists): $file${NC}"
        increment_counter "$SKIPPED_FILE"
        return 0
    fi
    
    echo -e "${BLUE}🔄 Converting: $file${NC}"
    
    if [ "$USE_CWEBP" = true ]; then
        # Use cwebp (better quality and smaller file size)
        # For HEIC files, we might need to convert via ImageMagick first
        if [[ "$file_name_lower" == *.heic ]] || [[ "$file_name_lower" == *.heif ]]; then
            # Convert HEIC to temporary PNG first, then to WebP
            temp_png="$TEMP_DIR/temp_$$.png"
            if (command -v convert &> /dev/null && convert "$file" "$temp_png" 2>/dev/null) || \
               (command -v magick &> /dev/null && magick "$file" "$temp_png" 2>/dev/null); then
                if cwebp -q "$QUALITY" "$temp_png" -o "$webp_file" 2>/dev/null; then
                    rm -f "$temp_png"
                    original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
                    webp_size=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file" 2>/dev/null)
                    saved=$((original_size - webp_size))
                    saved_percent=$((saved * 100 / original_size))
                    
                    if [ $saved -gt 0 ]; then
                        echo -e "${GREEN}✅ Converted: $file_name → $file_name_no_ext.webp (saved ${saved_percent}%)${NC}"
                    else
                        echo -e "${GREEN}✅ Converted: $file_name → $file_name_no_ext.webp${NC}"
                    fi
                    increment_counter "$CONVERTED_FILE"
                else
                    rm -f "$temp_png"
                    echo -e "${RED}❌ Failed: $file${NC}"
                    increment_counter "$FAILED_FILE"
                    return 1
                fi
            else
                echo -e "${RED}❌ Failed to convert HEIC: $file (ImageMagick needed for HEIC)${NC}"
                increment_counter "$FAILED_FILE"
                return 1
            fi
        else
            if cwebp -q "$QUALITY" "$file" -o "$webp_file" 2>/dev/null; then
                original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
                webp_size=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file" 2>/dev/null)
                saved=$((original_size - webp_size))
                saved_percent=$((saved * 100 / original_size))
                
                if [ $saved -gt 0 ]; then
                    echo -e "${GREEN}✅ Converted: $file_name → $file_name_no_ext.webp (saved ${saved_percent}%)${NC}"
                else
                    echo -e "${GREEN}✅ Converted: $file_name → $file_name_no_ext.webp${NC}"
                fi
                increment_counter "$CONVERTED_FILE"
            else
                echo -e "${RED}❌ Failed: $file${NC}"
                increment_counter "$FAILED_FILE"
                return 1
            fi
        fi
    else
        # Use ImageMagick
        if convert "$file" -quality "$QUALITY" "$webp_file" 2>/dev/null || \
           magick "$file" -quality "$QUALITY" "$webp_file" 2>/dev/null; then
            original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
            webp_size=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file" 2>/dev/null)
            saved=$((original_size - webp_size))
            saved_percent=$((saved * 100 / original_size))
            
            if [ $saved -gt 0 ]; then
                echo -e "${GREEN}✅ Converted: $file_name → $file_name_no_ext.webp (saved ${saved_percent}%)${NC}"
            else
                echo -e "${GREEN}✅ Converted: $file_name → $file_name_no_ext.webp${NC}"
            fi
            increment_counter "$CONVERTED_FILE"
        else
            echo -e "${RED}❌ Failed: $file${NC}"
            increment_counter "$FAILED_FILE"
            return 1
        fi
    fi
}

# Build find command with all extensions
FIND_CMD="find \"$FOLDER_PATH\" -type f \("
for ext in "${IMAGE_EXTENSIONS[@]}"; do
    FIND_CMD="$FIND_CMD -iname \"*.$ext\" -o"
done
# Remove last -o and close parentheses
FIND_CMD="${FIND_CMD% -o} \)"

# Debug: show what we're searching for
echo -e "${BLUE}Searching for extensions: ${IMAGE_EXTENSIONS[*]}${NC}"
echo ""

# Find all image files and process them
# Using process substitution to avoid subshell issues
eval "$FIND_CMD" | while IFS= read -r file; do
    if [ -f "$file" ]; then
        convert_to_webp "$file"
    fi
done

# Read counters before cleanup
TOTAL_FILES=$(cat "$TOTAL_FILE" 2>/dev/null || echo "0")
CONVERTED=$(cat "$CONVERTED_FILE" 2>/dev/null || echo "0")
SKIPPED=$(cat "$SKIPPED_FILE" 2>/dev/null || echo "0")
FAILED=$(cat "$FAILED_FILE" 2>/dev/null || echo "0")

# Cleanup temp directory
rm -rf "$TEMP_DIR" 2>/dev/null

# Summary
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Optimization Summary:${NC}"
echo -e "  Total files found: $TOTAL_FILES"
echo -e "  ${GREEN}Converted: $CONVERTED${NC}"
echo -e "  ${YELLOW}Skipped: $SKIPPED${NC}"
echo -e "  ${RED}Failed: $FAILED${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

