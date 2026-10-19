// Netlify runs this automatically after every successful deploy.
// When a production deploy puts a new Daily live, email it to the list right away.
import { sendTodaysDaily } from '../shared/daily-list.js';

export const handler = async (event) => {
  let deploy = {};
  try { deploy = JSON.parse(event.body || '{}').payload || {}; } catch {}

  const context = deploy.context || deploy.deploy?.context;
  if (context && context !== 'production') {
    return { statusCode: 200, body: `Skipped: ${context} deploy` };
  }

  try {
    const result = await sendTodaysDaily({ reason: 'deploy-succeeded' });
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (err) {
    console.error('Daily email after deploy failed:', err);
    return { statusCode: 200, body: `Error: ${err.message}` };
  }
};
