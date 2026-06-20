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
  return `
    <div style="background:#f2ede6;padding:32px;font-family:Inter,Arial,sans-serif;color:#1a1612;">
      <div style="max-width:680px;margin:0 auto;background:#fafaf8;border:1px solid #e8e0d4;padding:32px;">
        <p style="font-size:12px;letter-spacing:0.28em;text-transform:uppercase;color:#c4501a;margin:0 0 16px;">TheWrkShop Assessment</p>
        <h1 style="font-family:'Georgia',serif;font-size:32px;line-height:1.15;color:#2e2923;margin:0 0 16px;">Your Spiritual Gifts Results</h1>
        <p style="font-size:16px;line-height:1.7;color:#2e2923;margin:0 0 24px;">Here is your saved assessment summary so you can come back to it anytime, share it with your group, or bring it into your next leadership conversation.</p>
        <pre style="white-space:pre-wrap;font-family:'Courier New',monospace;font-size:14px;line-height:1.75;background:#f2ede6;border:1px solid #e8e0d4;padding:20px;color:#1a1612;margin:0;">${escapeHtml(summary)}</pre>
      </div>
    </div>
  `;
}
