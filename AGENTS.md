<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Product architecture — keep districts separate

The Avenue (digital editorial/social, `/member/avenue`), The City (physical/local
discovery, `/member/city`), and Happenings (events, `/member/happenings`) are
**separate districts** and must not be merged. **The Edit** is the Avenue's
editorial hub (Member Edits, Club Edits, BloomBay Edit, BloomBay Magazine) and
lives under The Avenue, never The City. Before changing any of these, read
`docs/AVENUE-CITY-EDIT.md`.
