# VIBE CODING 101: ADVANCED STYLE GUIDE

<div align="center">
<img src="https://img.shields.io/badge/Version-2025.1-blue?style=for-the-badge" alt="Version 2025.1"/>
<img src="https://img.shields.io/badge/Authors-Matty_Squarzoni_&_Dr._Ernesto_Lee-orange?style=for-the-badge" alt="Authors"/>
</div>

---

## Table of Contents

1. [Chapter Structure](#chapter-structure)
2. [README Formatting](#readme-formatting)
3. [Content Organization](#content-organization)
4. [Visual Elements](#visual-elements)
5. [Navigation System](#navigation-system)
6. [Code Examples](#code-examples)
7. [Exercise Formatting](#exercise-formatting)
8. [Filename Conventions](#filename-conventions)
9. [Markdown Best Practices](#markdown-best-practices)
10. [Color Palette](#color-palette)

---

## Chapter Structure

Each chapter must maintain the following standardized directory structure:

```
Chapter_XX_Title/
├── README.md                      # Chapter overview and navigation
├── Chapter_XX_Beginner.md         # Beginner-level content
├── Chapter_XX_Advanced.md         # Advanced-level content (or Part1, Part2 if split)
├── Chapter_XX_Ninja.md            # Ninja-level content (or Part1, Part2 if split)
├── Further_Reading.md             # Additional resources and references
├── exercises/                     # Hands-on activities
│   ├── exercise_1_name.md
│   ├── exercise_2_name.md
│   └── exercise_3_name.md
├── examples/                      # Code examples and demonstrations
│   ├── example_1.js
│   └── example_2.py
├── images/                        # Visual assets for the chapter
│   └── diagram_name.png
└── resources/                     # Additional materials
    └── resource_name.md
```

**Note**: If advanced or ninja content is extensive, it should be split into multiple parts (e.g., `Chapter_XX_Advanced_Part1.md`, `Chapter_XX_Advanced_Part2.md`).

---

## README Formatting

Each chapter README should follow this structure:

### Header Section
```html
<div align="center">

# <img src="https://img.shields.io/badge/-CHAPTER_X-HexColor?style=for-the-badge"/> CHAPTER TITLE

<p align="center">
<i>"Compelling tagline that captures the chapter's essence"</i>
</p>

</div>

---
```

### Chapter Overview Section
```html
## 🚀 Chapter Overview

Brief description of the chapter (2-3 paragraphs).

<div align="center">
<img src="https://img.shields.io/badge/Reading_Time-XX_minutes-blue?style=flat-square"/>
<img src="https://img.shields.io/badge/Practice_Time-XX_minutes-green?style=flat-square"/>
</div>
```

### Learning Objectives Section
```html
## 📚 What You'll Learn

- **Topic One**: Brief description
- **Topic Two**: Brief description
- **Topic Three**: Brief description
- **Topic Four**: Brief description
- **Topic Five**: Brief description
```

### Audience Section
```html
## 🎯 Target Audience

<table>
  <tr>
    <td align="center"><b><a href="./Chapter_XX_Beginner.md">🌱 BEGINNER</a></b></td>
    <td>Brief description of beginner-level content and intended audience.</td>
  </tr>
  <tr>
    <td align="center"><b><a href="./Chapter_XX_Advanced.md">🔧 ADVANCED</a></b></td>
    <td>Brief description of advanced-level content and intended audience.</td>
  </tr>
  <tr>
    <td align="center"><b><a href="./Chapter_XX_Ninja.md">⚡ NINJA</a></b></td>
    <td>Brief description of ninja-level content and intended audience.</td>
  </tr>
</table>
```

### Key Concepts Section
```html
## 🧩 Key Concepts

<table>
  <tr>
    <td width="50%" align="center">
      <h3>Concept Group 1</h3>
      <ul align="left">
        <li><b>Concept A</b>: Brief description</li>
        <li><b>Concept B</b>: Brief description</li>
        <li><b>Concept C</b>: Brief description</li>
      </ul>
    </td>
    <td width="50%" align="center">
      <h3>Concept Group 2</h3>
      <ul align="left">
        <li><b>Concept D</b>: Brief description</li>
        <li><b>Concept E</b>: Brief description</li>
        <li><b>Concept F</b>: Brief description</li>
      </ul>
    </td>
  </tr>
</table>
```

### Additional Sections as Needed

Including diagram, applications, prerequisites, exercises, etc.

### Footer Section
```html
<div align="center">

> *"Compelling quote that summarizes the chapter's importance"*

[<img src="https://img.shields.io/badge/⬅️_Previous_Chapter-blue?style=for-the-badge"/>](../Previous_Chapter/README.md)
[<img src="https://img.shields.io/badge/⬆️_Back_to_Contents-green?style=for-the-badge"/>](../README.md)
[<img src="https://img.shields.io/badge/➡️_Next_Chapter-orange?style=for-the-badge"/>](../Next_Chapter/README.md)

</div>
```

---

## Content Organization

### Content File Structure

Each content file (Beginner, Advanced, Ninja) should follow this structure:

1. **Title and Introduction**
   - H1 title
   - Brief introduction to the topic
   - Learning goals for this section

2. **Main Content Sections**
   - Use H2 headings for main sections
   - Use H3 headings for subsections
   - Include code snippets, diagrams, and examples as appropriate

3. **Practical Applications**
   - Real-world examples
   - Use cases
   - Implementation guidelines

4. **Summary and Key Takeaways**
   - Recap of main points
   - Connection to other chapters or topics

5. **Next Steps**
   - References to exercises
   - Links to further reading
   - Preview of more advanced content

---

## Visual Elements

### Icons and Emojis

Use these standardized emojis for consistent visual cues:

- 🚀 - Chapter overview, getting started
- 📚 - Learning objectives, what you'll learn
- 🎯 - Target audience, goals
- 🧩 - Key concepts, important ideas
- 💡 - Tips, insights
- ⚠️ - Warnings, common pitfalls
- 🔍 - Deep dives, detailed explanations
- 🛠️ - Tools, practical applications
- 📊 - Data, diagrams, visualizations
- 📝 - Exercises, hands-on activities
- 🔑 - Key terms, important vocabulary
- 📋 - Prerequisites, requirements
- 📚 - Further reading, resources

### Badges

Use badges for visual emphasis and consistency:

```html
<img src="https://img.shields.io/badge/TEXT-COLOR?style=for-the-badge"/>
<img src="https://img.shields.io/badge/TEXT-COLOR?style=flat-square"/>
```

### Chapter Color Codes

Each chapter should use a consistent color for visual identity:

- Chapter 1: `#f39c12` (Amber)
- Chapter 2: `#27ae60` (Emerald)
- Chapter 3: `#8e44ad` (Purple)
- Chapter 4: `#2ecc71` (Green)
- Chapter 5: `#9b59b6` (Violet)
- Chapter 6: `#e74c3c` (Red)
- Chapter 7: `#1abc9c` (Teal)
- Chapter 8: `#3498db` (Blue)
- Chapter 9: `#e67e22` (Orange)
- Chapter 10: `#3498db` (Blue)
- Chapter 11: `#27ae60` (Green)
- Chapter 12: `#9b59b6` (Purple)

---

## Navigation System

### Internal Navigation

Each chapter should include these navigation elements:

1. **Table of Contents** at the beginning of lengthy documents
2. **Section Links** for jumping between major sections
3. **Back to Top** links at the end of long sections

### External Navigation

Include these consistent navigation buttons:

1. **Previous Chapter** - Link to the previous chapter
2. **Back to Contents** - Link to the main README
3. **Next Chapter** - Link to the next chapter

---

## Code Examples

### Code Block Formatting

Use triple backticks with language identifier:

````
```javascript
// Code example here
```
````

### Example Types

Include these types of examples:

1. **Snippets** - Short code fragments demonstrating specific concepts
2. **Complete Files** - Full implementations of the concepts
3. **Progressively Built Examples** - Step-by-step code development

---

## Exercise Formatting

Each exercise file should follow this structure:

```markdown
# Exercise X: Descriptive Title

## Overview

Brief description of the exercise (1-2 paragraphs).

## Learning Objectives

- Specific learning goal 1
- Specific learning goal 2
- Specific learning goal 3

## Prerequisites

- Required knowledge/skills
- Required tools/environment

## The Challenge

Detailed description of what needs to be accomplished.

## Step 1: First Task

Instructions for completing the first step.

## Step 2: Second Task

Instructions for completing the second step.

## Step X: Final Task

Instructions for completing the final step.

## Deliverables

- Specific output 1
- Specific output 2
- Specific output 3

## Evaluation Criteria

How to determine if the exercise was completed successfully.

## Bonus Challenges

Optional additional tasks for those who want to push further.
```

---

## Filename Conventions

### Main Files

- `Chapter_XX_Title` - Chapter folder
- `README.md` - Chapter overview
- `Chapter_XX_Beginner.md` - Beginner content
- `Chapter_XX_Advanced.md` - Advanced content (or _Part1, _Part2)
- `Chapter_XX_Ninja.md` - Ninja content (or _Part1, _Part2)
- `Further_Reading.md` - Additional resources

### Supporting Files

- `exercise_X_name.md` - Exercise files
- `example_name.extension` - Code examples
- `resource_name.md` - Additional resources

---

## Markdown Best Practices

### Text Formatting

- Use **bold** for emphasis on important concepts
- Use *italic* for new terms and slight emphasis
- Use `code` for inline code references, commands, and filenames
- Use > blockquotes for notable quotes or callouts

### Lists

- Use numbered lists for sequential steps
- Use bullet points for non-sequential items
- Use nested lists for hierarchical information

### Tables

- Use tables for structured data and comparisons
- Include headers for each column
- Align content appropriately (left for text, center for headers)

---

## Color Palette

### Primary Colors

- `#3498db` - Primary Blue
- `#27ae60` - Primary Green
- `#e74c3c` - Primary Red
- `#f39c12` - Primary Orange
- `#9b59b6` - Primary Purple

### Secondary Colors

- `#2c3e50` - Dark Blue (Text)
- `#7f8c8d` - Gray (Secondary Text)
- `#ecf0f1` - Light Gray (Background)
- `#1abc9c` - Teal (Accents)
- `#d35400` - Dark Orange (Warnings)

### Usage Guidelines

- Use primary colors for major elements (headers, buttons)
- Use secondary colors for supporting elements
- Maintain sufficient contrast for readability
- Be consistent with color usage across chapters
