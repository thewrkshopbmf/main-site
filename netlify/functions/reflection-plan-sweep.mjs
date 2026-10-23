// Sends the next day of each 7-day email plan (One Verse Man reflection, Pattern Finder, Belief Project), once each morning.
import { sendPlanDays } from '../shared/reflection-list.js';

export default async () => {
  try {
    console.log(JSON.stringify(await sendPlanDays({ tool: 'moments' })));
  } catch (err) {
    console.error('Moments plan sweep failed:', err);
  }
  try {
    console.log(JSON.stringify(await sendPlanDays({ tool: 'pattern-finder' })));
  } catch (err) {
    console.error('Pattern Finder plan sweep failed:', err);
  }
  try {
    console.log(JSON.stringify(await sendPlanDays({ tool: 'belief' })));
  } catch (err) {
    console.error('Belief Project plan sweep failed:', err);
  }
  return new Response('ok');
};

// :05 past each hour, 11:05–17:05 UTC. That's 6:05 am–12:05 pm in summer (CDT) and
// 5:05–11:05 am in winter (CST); the sender itself only sends between 6 am and noon Central.
export const config = { schedule: '5 11-17 * * *' };
