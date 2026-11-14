// Netlify runs this automatically after every successful deploy.
// When a production deploy puts a new Daily live, ping IndexNow (netlify/shared/indexnow.js) and
// email it to the list, but never
// before 5:30 am Central (the 12:01 am release waits for the 5:30 scheduled send).
import { sendTodaysDaily } from '../shared/daily-list.js';
import { sendThisWeekend } from '../shared/weekend-list.js';
import { pingIndexNow } from '../shared/indexnow.js';

export const handler = async (event) => {
  let deploy = {};
  try { deploy = JSON.parse(event.body || '{}').payload || {}; } catch {}

  const context = deploy.context || deploy.deploy?.context;
  if (context && context !== 'production') {
    return { statusCode: 200, body: `Skipped: ${context} deploy` };
  }

  // Tell Bing and other IndexNow search engines about today's new pages. It runs alongside the
  // email (not before it), and a failed ping never affects the email.
  const pinging = pingIndexNow()
    .then((ping) => console.log('IndexNow:', JSON.stringify(ping)))
    .catch((err) => console.error('IndexNow ping failed:', err));

  // Weekend 4-3-2-1: emailed when the Friday 2 pm post goes live (does nothing on other deploys).
  const weekend = sendThisWeekend({ reason: 'deploy-succeeded' })
    .then((r) => console.log('Weekend email:', JSON.stringify(r)))
    .catch((err) => console.error('Weekend email after deploy failed:', err));

  try {
    const result = await sendTodaysDaily({ reason: 'deploy-succeeded' });
    await weekend;
    await pinging;
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (err) {
    console.error('Daily email after deploy failed:', err);
    await weekend;
    await pinging;
    return { statusCode: 200, body: `Error: ${err.message}` };
  }
};
