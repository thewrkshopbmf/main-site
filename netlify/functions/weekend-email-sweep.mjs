// Backup for the Weekend 4-3-2-1 email: deploy-succeeded sends it when the Friday 2 pm post goes
// live; this re-checks each hour that afternoon/evening so anyone missed still gets it.
// The sender itself only sends on the post's own date, between 2 pm and 10 pm Central.
import { sendThisWeekend } from '../shared/weekend-list.js';

export default async () => {
  try {
    console.log(JSON.stringify(await sendThisWeekend({ reason: 'hourly-sweep' })));
  } catch (err) {
    console.error('Weekend email sweep failed:', err);
  }
  return new Response('ok');
};

// :20 past each hour, 19:20–03:20 UTC (covers 2 pm–10 pm Central in summer and winter).
export const config = { schedule: '20 0-3,19-23 * * *' };
