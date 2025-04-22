#!/usr/bin/env python3
"""
Script to fix navigation links in Vibe Coding Book markdown files.
This script will update all navigation links to use the proper directory structure.
"""

import os
import re
import glob
from pathlib import Path

# Define chapter directory names (in order)
CHAPTER_DIRS = [
    "Chapter_01_The_Vibe_Coding_Revolution",
    "Chapter_02_Getting_Started_with_Vibe_Coding",
    "Chapter_03_Building_Real_Projects_with_AI_Assistance",
    "Chapter_04_AI_Powered_Backend_Development",
    "Chapter_05_Full_Stack_Development_with_AI",
    "Chapter_06_Advanced_Prompt_Engineering",
]

# Map short names to full directory names
SHORT_TO_FULL = {
    f"Chapter_{i+1:02d}": dir_name
    for i, dir_name in enumerate(CHAPTER_DIRS)
}

def fix_navigation_links(file_path, chapter_index):
    """Fix navigation links in a single markdown file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Get current chapter directory name
    current_chapter_dir = CHAPTER_DIRS[chapter_index]
    
    # Determine previous and next chapter directory names
    prev_chapter_dir = CHAPTER_DIRS[chapter_index - 1] if chapter_index > 0 else None
    next_chapter_dir = CHAPTER_DIRS[chapter_index + 1] if chapter_index < len(CHAPTER_DIRS) - 1 else None
    
    # Extract the chapter file type (Beginner/Advanced/Ninja/Main)
    file_name = os.path.basename(file_path)
    file_type = file_name.split('_')[-1].split('.')[0]  # Extract 'Beginner', 'Advanced', etc.
    chapter_num = f"{chapter_index + 1:02d}"  # Format as '01', '02', etc.
    
    # Create the correct navigation links
    prev_link = f"../{prev_chapter_dir}/Chapter_{chapter_index:02d}_Main.md" if prev_chapter_dir else None
    next_link = f"../{next_chapter_dir}/Chapter_{chapter_index+2:02d}_Main.md" if next_chapter_dir else None
    
    # Fix previous/next chapter navigation
    if prev_chapter_dir:
        content = re.sub(
            r'\[\⬅️\s*Previous\s*Chapter\]\([^)]*\)',
            f'[⬅️ Previous Chapter](../{prev_chapter_dir}/Chapter_{chapter_index:02d}_Main.md)',
            content
        )
    
    if next_chapter_dir:
        content = re.sub(
            r'\[➡️\s*Next\s*Chapter\]\([^)]*\)',
            f'[➡️ Next Chapter](../{next_chapter_dir}/Chapter_{chapter_index+2:02d}_Main.md)',
            content
        )
    
    # Fix Table of Contents link
    content = re.sub(
        r'\[📚\s*Table\s*of\s*Contents\]\([^)]*\)',
        '[📚 Table of Contents](../README.md)',
        content
    )
    
    # Fix skill level navigation links
    beginner_link = f'[🔰 Beginner](./Chapter_{chapter_num}_Beginner.md)'
    advanced_link = f'[⚙️ Advanced](./Chapter_{chapter_num}_Advanced.md)'
    ninja_link = f'[⚔️ Ninja](./Chapter_{chapter_num}_Ninja.md)'
    main_link = f'[📝 Main](./Chapter_{chapter_num}_Main.md)'
    
    # Create the new navigation section
    nav_section = f'''<div align="center">

**{'[⬅️ Previous Chapter](../' + prev_chapter_dir + '/Chapter_' + str(chapter_index).zfill(2) + '_Main.md) | ' if prev_chapter_dir else ''}[📚 Table of Contents](../README.md){'| [➡️ Next Chapter](../' + next_chapter_dir + '/Chapter_' + str(chapter_index+2).zfill(2) + '_Main.md)' if next_chapter_dir else ''}**

</div>

<div align="center">

**{beginner_link} | {advanced_link} | {ninja_link} | {main_link}**

</div>

<div align="center">

*© 2025 VibeCoding - Where Human Creativity Meets AI Capabilities*

</div>'''

    # Use regex to replace the navigation sections (both top and bottom)
    # First find all div tags
    div_pattern = r'<div align="center">\s*\*\*\[.*?\]\(.*?\)(?: \| \[.*?\]\(.*?\))*\*\*\s*</div>\s*<div align="center">\s*\*\*\[.*?\]\(.*?\)(?: \| \[.*?\]\(.*?\))*\*\*\s*</div>(?:\s*<div align="center">\s*\*.*?\*\s*</div>)?'
    
    # Count how many navigation sections we found
    nav_sections = re.findall(div_pattern, content)
    
    if len(nav_sections) >= 1:
        # Replace the first navigation section
        content = re.sub(div_pattern, nav_section, content, count=1)
    
    if len(nav_sections) >= 2:
        # Replace the second navigation section
        content = re.sub(div_pattern, nav_section, content, count=1)
    
    # Fix any other broken links or patterns
    # Replace placeholder chapter links like ../Chapter_05_*
    content = re.sub(
        r'\.\./Chapter_(\d+)_\*',
        lambda m: f'../{CHAPTER_DIRS[int(m.group(1))-1]}',
        content
    )
    
    # Standardize chapter titles if needed
    if file_type == 'Beginner':
        title_pattern = r'# .*?Beginner.*? #'
        replacement = f'# 🔰 Chapter {chapter_index+1}: {CHAPTER_DIRS[chapter_index].replace("Chapter_" + chapter_num + "_", "").replace("_", " ")} (Beginner Level) 🔰'
        content = re.sub(title_pattern, replacement, content, flags=re.IGNORECASE)
    
    elif file_type == 'Advanced':
        title_pattern = r'# .*?Advanced.*? #'
        replacement = f'# ⚙️ Chapter {chapter_index+1}: {CHAPTER_DIRS[chapter_index].replace("Chapter_" + chapter_num + "_", "").replace("_", " ")} (Advanced Level) ⚙️'
        content = re.sub(title_pattern, replacement, content, flags=re.IGNORECASE)
    
    elif file_type == 'Ninja':
        title_pattern = r'# .*?Ninja.*? #'
        replacement = f'# ⚔️ Chapter {chapter_index+1}: {CHAPTER_DIRS[chapter_index].replace("Chapter_" + chapter_num + "_", "").replace("_", " ")} (Ninja Level) ⚔️'
        content = re.sub(title_pattern, replacement, content, flags=re.IGNORECASE)
    
    elif file_type == 'Main':
        title_pattern = r'# .*?Chapter.*? #'
        replacement = f'# 📝 Chapter {chapter_index+1}: {CHAPTER_DIRS[chapter_index].replace("Chapter_" + chapter_num + "_", "").replace("_", " ")} (2025 Edition) 📝'
        content = re.sub(title_pattern, replacement, content, flags=re.IGNORECASE)
    
    # Write the updated content back to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Fixed links in {file_path}")

def process_all_files(base_dir):
    """Process all markdown files in all chapter directories."""
    for chapter_idx, chapter_dir in enumerate(CHAPTER_DIRS):
        chapter_path = os.path.join(base_dir, chapter_dir)
        
        # Create directory if it doesn't exist
        os.makedirs(chapter_path, exist_ok=True)
        
        # Process all md files in the directory
        for md_file in glob.glob(os.path.join(chapter_path, "*.md")):
            fix_navigation_links(md_file, chapter_idx)

if __name__ == "__main__":
    # Directory where the clean repository is cloned
    base_dir = "/tmp/vibe_book_cleanup/VIbeCoding_1101_Book"
    process_all_files(base_dir)
    print("All navigation links fixed successfully!")
