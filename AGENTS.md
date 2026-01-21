# Encoding guardrails for Codex runs

## Idioma obrigatorio
- Escreva todas as respostas e textos em pt-br (inclusive trechos adicionados a docs e posts).

## Why text looks like mojibake in the terminal
- This repo's Portuguese copy is UTF-8 and renders correctly in the browser/editor.
- PowerShell or the console can decode UTF-8 using a legacy code page (CP1252/CP850), so `funções`, `destilação`, and similar words may appear mangled.
- That display glitch does not mean the file is broken. Do not "fix" it by stripping accents.

## How to handle it safely
1. Prefer `apply_patch` for textual edits to preserve UTF-8 bytes.
2. When scripting, always read/write with `encoding='utf-8'`.
3. If you must verify characters in the terminal, switch to UTF-8 (`chcp 65001`) and use `Get-Content -Encoding UTF8` or a UTF-8-aware editor.
4. Only repair text if the user confirms real corruption; use proper diacritics, never ASCII replacements.

## Past mistake to avoid
- Avoided non-ASCII in ad-hoc scripts and replaced diacritics; that regressed copy quality.
