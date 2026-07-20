# Context

Sanity v3 backend for "All Visible Objects", modeled after the studio-obelo backend approach (field helpers for media, wysiwyg/portable text, status, seo).

## Glossary

### Collaborator
Merged doc-type replacing the earlier separate Organization and Person types — no distinction is made between an individual and a studio/company in a credit line. Fields: title, slug, href (plain string, no label). Referenced from Work.credits.

### Work block
One row in Work's block-based layout (doc-type `work` — what was informally called "Project" during planning). Holds an array of up to 4 items, each item typed `text` | `media` | `empty`. `empty` is an explicit spacer item the editor adds on purpose to control column layout, not just an unset slot. This differs from studio-obelo's `blocks.js` (typed full-width blocks like mediaBlock/textBlock/workReferenceBlock) — Work blocks are row/grid-shaped instead.

### Capability
Merged doc-type replacing the earlier separate Service and Typology types (title, slug — same shape both had). Work.typology (single ref) and Work.services (array of refs), and about.capabilities (array of refs), all point at Capability now — the field *names* stayed (typology/services/capabilities all still exist and mean what they meant before), only the target *type* they reference was unified. No orderRankField.

### Status field scope
Only `client` and `work` carry the `status` field (draft/public/hidden + badge, from obelo's `fields/status.js`). Hiding a Client hides it and, by extension, the works only reachable through it. Collaborator/Capability have no status — they're pure reference data, not standalone pages.

### Ordering
Only `client` gets `orderRankField` (drag-order in the Client list). Work has no orderRankField of its own — everywhere Work order matters (Homepage.works, Client.works) it's driven by array position on the referencing doc, not a field on Work itself. Capability/Collaborator stay in default order.

### Work credit
One line in Work.credits: `{role: string, collaborators: array of refs to Collaborator}`. E.g. role "Photography" pointing at one Collaborator. (Field was named `entities` referencing Person|Organization before the Collaborator merge.)

### about.commissions vs about.capabilities
Two distinct fields on the `about` doc. Capabilities = array of refs to [[Capability]] (what the studio offers). Commissions = array of `{label: string, href: url}` (same object shape as obelo's `work.link`) — free-text named items with an optional external link, NOT Capability refs.

### Naming: "about", not "Info"
The doc referred to informally as "Info" in planning is the `about` doc-type (singleton, like obelo's `about.js`) — canonical name is "about".

### Naming: "work", not "Project"
The doc referred to informally as "Project" in planning is the `work` doc-type — canonical name is "work" / "works", matching studio-obelo's own naming for its portfolio-entry doc-type (a coincidence — the two repos are unrelated).

### Homepage.works / about.clients
Both are ordered arrays of references (Homepage → Work[], about → Client[]), not single refs.

### Link object
Shared `{label: string, href: url}` shape (from obelo's `work.link`), reused for about.commissions items. Not used by Collaborator, which just has a plain `href` string field (no label — superseded the earlier Person/Organization `link` field, see [[Collaborator]]).

### Cursor follower
Floating tag that tracks the pointer over an interactive target — either a text label ("View project" on homepage works) or a directional arrow (gallery prev/next zones). One follower exists at a time, owned by the component whose targets it describes. It stays fully inside the viewport: slides progressively along the horizontal edges, flips above the cursor near the bottom edge. Doesn't exist on touch devices (no pointer to follow).

### Media placeholder
Every media block (image or video) shows an instantly-available blurred preview of itself from the moment it exists on the page — never an empty box. It sharpens (deblurs) once, per page view, and only when both are true: the real asset has loaded AND the block has entered the viewport — so the sharpening is always seen, never wasted offscreen. It does not re-blur on scroll within the same page view.

### Page transition
Cross-fade between routes: the outgoing page stays visually frozen at its current scroll position while fading out; the incoming page fades in already at the top. The document itself never animates its scroll during navigation — smooth scrolling exists only as an explicit in-page movement (footer back-to-top, "Details +"), never as a global document behavior.

### Work header
On a work page, the global menu items (Works, About, Instagram) all disappear (same fade treatment) and the work's own header row takes over the menu area: client name, work title, "Details +", play trigger (only when gallery media exists), and a Close tag pinned at the right edge that returns to the homepage. The client name is itself a dropdown trigger behaving like the global "Works" item: it opens a column below listing all of that client's works (same source and editorial order as the global Works dropdown, hidden works excluded, no count badge), with the work being viewed marked active. If the client isn't in the nav data (hidden client, reachable only because the individual work itself isn't hidden), the client name is omitted entirely — no fallback text.

This row is a page-transition-independent fixture, not part of the work page itself: it lives above the per-route page content (which fully remounts on every navigation) so that browsing between works under the same client never resets the client dropdown — its open/closed state, scroll position, and focus survive the navigation untouched. Only the title (and the play trigger's visibility) animate in place when the underlying work changes; the client dropdown only auto-closes when the client itself changes (a different client, or leaving the work template entirely) — never on a same-client sibling pick.

### Nav mode
Global input-mode switch for all dropdown triggers (global Works menu and the work header's client dropdown alike): mouseover mode (default — hover opens) or click mode, toggled with Shift+N. One mode applies everywhere at once; half-applying it per-dropdown is wrong by definition. Close is navigation, not a dismissal: Escape never triggers it — Escape belongs solely to the gallery overlay. When the row runs out of room, client/title truncate with ellipsis (title gives way first); action tags never shrink. Desktop-only behavior for now, like the rest of the header system. Losing the Works dropdown on work pages is deliberate: related works, Close, and the logo cover navigation from there.

### Client → Work link
Superseded — see below. (Originally: Client.works was the only stored field, Work had no client ref back, reverse lookup was GROQ-only. Reversed once routing turned out to be client-scoped: `/client-slug/work-slug` needs per-client slug uniqueness and the Studio needs a synchronous "which client" subtitle on Work, neither of which a GROQ-only back-reference can give — `components.preview` in Sanity Studio never receives the document `_id`, so a live reverse lookup isn't possible there.)

Both directions are now stored, deliberately, with one authoritative side each:
- **Work.client** (single required ref) is authoritative for *ownership*: drives the Work preview subtitle. Slug uniqueness is NOT enforced at all (`isUnique: () => true` disables Sanity's default global check, no custom validation replaces it) — duplicate slugs are allowed everywhere, including two works under the same client, by deliberate choice.
- **Client.works** (array of refs) is authoritative for *editorial ordering*: the position of works within a given client's list, since that ordering isn't derivable from anything on Work itself.

Sanity has no native bidirectional-sync field. Drift is prevented, not auto-corrected: Client.works' reference picker is filtered (`options.filter`) to only offer works whose own `client` already points back to that client, and a validation rule re-checks this on save and blocks publish if a work's `client` was changed elsewhere after being added.
