import { CLUSTERS, GIFTS } from './assessment-data.js';

export function computeTopCluster(normalized) {
  const clusterScores = {};
  Object.keys(CLUSTERS).forEach((cluster) => {
    clusterScores[cluster] = 0;
  });

  Object.entries(normalized || {}).forEach(([giftKey, score]) => {
    const category = GIFTS[giftKey]?.category;
    if (category && clusterScores[category] !== undefined) {
      clusterScores[category] += Number(score) || 0;
    }
  });

  const [clusterKey] = Object.entries(clusterScores).sort((a, b) => b[1] - a[1])[0] || [];
  return {
    clusterKey,
    cluster: clusterKey ? CLUSTERS[clusterKey] : null
  };
}

export function buildShareSummary(results) {
  const sorted = Object.entries(results || {}).sort((a, b) => b[1] - a[1]);
  const topFive = sorted.slice(0, 5);
  const [primaryKey, primaryScore] = topFive[0] || [];
  const primaryGift = primaryKey ? GIFTS[primaryKey] : null;
  const { cluster } = computeTopCluster(results || {});
  const shadowNames = primaryGift ? primaryGift.shadow.map((giftKey) => GIFTS[giftKey].name) : [];

  if (!primaryGift || !cluster) {
    return 'Assessment results are unavailable.';
  }

  return [
    'SPIRITUAL GIFTS ASSESSMENT - TheWrkShop',
    '--------------------------------------------',
    '',
    `PRIMARY GIFT: ${primaryGift.name.toUpperCase()} (${primaryScore}%)`,
    '',
    primaryGift.desc,
    '',
    'TOP 5 GIFTS:',
    ...topFive.map(([giftKey, score], index) => `  ${index + 1}. ${GIFTS[giftKey].name} - ${score}%`),
    '',
    'SHADOW GIFTS:',
    `  ${shadowNames[0]} + ${shadowNames[1]}`,
    `  ${primaryGift.shadowNote}`,
    '',
    `GIFT CLUSTER: ${cluster.name.toUpperCase()}`,
    `  ${cluster.identity}`,
    `  WHERE YOU BELONG: ${cluster.placement}`,
    `  WHO YOU NEED: ${cluster.partners}`,
    '',
    'thewrkshop.com'
  ].join('\n');
}

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildResultsEmailHtml(results) {
  const summary = buildShareSummary(results);
  // Colors: the site's editorial palette (same values as netlify/shared/email-colors.js).
  return `
    <div style="background:#edf0e7;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#2b2b2b;">
      <div style="max-width:680px;margin:0 auto;background:#fffefa;border:1px solid #dedfd6;border-radius:12px;overflow:hidden;">
        <div style="background:#243d37;padding:18px;text-align:center;">
          <a href="https://thewrkshop.com"><img src="https://thewrkshop.com/assets/images/thewrkshop-logo-transparent-trimmed.png" width="104" height="80" alt="TheWrkShop" style="display:inline-block;border:0;"></a>
        </div>
        <div style="padding:32px;">
          <p style="font-size:12px;font-weight:700;letter-spacing:0.13em;text-transform:uppercase;color:#3f6f5c;margin:0 0 16px;">TheWrkShop Assessment</p>
          <h1 style="font-family:'Segoe UI',Arial,Helvetica,sans-serif;font-weight:600;font-size:30px;line-height:1.15;color:#243d37;margin:0 0 16px;">Your Spiritual Gifts Results</h1>
          <p style="font-size:16px;line-height:1.7;color:#2b2b2b;margin:0 0 24px;">Here is your saved assessment summary so you can come back to it anytime, share it with your group, or bring it into your next leadership conversation.</p>
          <pre style="white-space:pre-wrap;font-family:'Courier New',monospace;font-size:14px;line-height:1.75;background:#edf0e7;border-left:4px solid #243d37;border-radius:0 8px 8px 0;padding:20px;color:#243d37;margin:0;">${escapeHtml(summary)}</pre>
          <p style="font-size:12px;line-height:1.6;color:#59655f;margin:24px 0 0;">— TheWrkShop · <a href="https://thewrkshop.com" style="color:#59655f;">thewrkshop.com</a></p>
        </div>
      </div>
    </div>
  `;
}
