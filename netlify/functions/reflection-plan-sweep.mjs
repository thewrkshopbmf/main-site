// Sends the next day of each One Verse Man 7-day plan, once each morning.
import { sendPlanDays } from '../shared/reflection-list.js';

export default async () => {
  try {
    console.log(JSON.stringify(await sendPlanDays()));
  } catch (err) {
    console.error('Reflection plan sweep failed:', err);
  }
  return new Response('ok');
};

// :05 past each hour, 11:05–17:05 UTC. That's 6:05 am–12:05 pm in summer (CDT) and
// 5:05–11:05 am in winter (CST); the sender itself only sends between 6 am and noon Central.
export const config = { schedule: '5 11-17 * * *' };
