// Sends today's Daily at 5:30 am Central, then re-checks each hour until noon
// so anyone missed (or a Daily released later in the morning) still gets it.
import { sendTodaysDaily } from '../shared/daily-list.js';

export default async () => {
  try {
    const result = await sendTodaysDaily({ reason: 'hourly-sweep' });
    console.log(JSON.stringify(result));
  } catch (err) {
    console.error('Daily email sweep failed:', err);
  }
  return new Response('ok');
};

// :30 past each hour, 10:30–18:30 UTC. That's 5:30 am–1:30 pm in summer (CDT) and
// 4:30 am–12:30 pm in winter (CST); the sender itself skips anything before 5:30 or after noon.
export const config = { schedule: '30 10-18 * * *' };
