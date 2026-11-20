// TheWrkShop email colors: the site's editorial palette (Nov 2026), in one place.
// Every email (and the small confirm / unsubscribe pages) reads from here, so a future
// palette change is one edit. Emails need literal hex values (no CSS variables in inboxes).
export const EMAIL_COLORS = {
  ink: '#243d37',        // deep ink green: header band, headings, buttons, accent bars
  inkHover: '#426b60',
  accent: '#3f6f5c',     // softer green: subheads, small labels, focus highlights
  sage: '#a5b4a2',
  wash: '#edf0e7',       // light sage wash: quotes, callouts, outer email background
  tint: '#e9eee5',       // soft card tint / bar tracks
  paper: '#fffefa',      // card background
  line: '#dedfd6',
  text: '#2b2b2b',       // body copy
  muted: '#59655f',      // footers, secondary copy
  onInk: '#f4f1ee',      // light text on ink green
  onInkSoft: '#d6e2da',
  onInkLabel: '#b9cfc2', // small labels and links on ink green
  // Weekend 4-3-2-1 only: one warm bronze accent beside the green, as on the blog post
  bronze: '#b47737',
  bronzeTint: '#fbf3e4',
  bronzeText: '#8a5524'
};
