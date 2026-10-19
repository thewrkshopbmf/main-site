// Safety net: every hour from midnight to noon (Central), make sure everyone
// has received today's Daily, in case the after-deploy send was missed or interrupted.
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

// :10 past each hour, 05:00–18:00 UTC (covers midnight–noon Central in both CST and CDT)
export const config = { schedule: '10 5-18 * * *' };
