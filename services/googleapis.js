const { google } = require("googleapis");
const analytics = google.analytics("v3");
const dotenv = require("dotenv");

dotenv.config();

const scopes = "https://www.googleapis.com/auth/analytics.readonly";
const viewId = process.env.VIEW_ID;
const clientEmail = process.env.CLIENT_EMAIL;
const privateKey = process.env.PRIVATE_KEY.replace(new RegExp('\\\\n', 'g'), '\n');
const jwt = new google.auth.JWT(clientEmail, null, privateKey, scopes);

async function getMetric(metric, startDate, endDate) {
  await setTimeout[Object.getOwnPropertySymbols(setTimeout)[0]](
    Math.trunc(1000 * Math.random())
  );

  const result = await analytics.data.ga.get({
    auth: jwt,
    ids: `ga:${viewId}`,
    "start-date": startDate,
    "end-date": endDate,
    metrics: metric,
  });

  const res = {};
  res[metric] = {
    value: parseInt(result.data.totalsForAllResults[metric], 10),
    start: startDate,
    end: endDate,
  };
  return res;
}

function parseMetric(metric) {
  let cleanMetric = metric;
  if (!cleanMetric.startsWith("ga:")) {
    cleanMetric = `ga:${cleanMetric}`;
  }
  return cleanMetric;
}

exports.getData = async (
  metrics = ["ga:users", "ga:pageviews"],
  startDate = "30daysAgo",
  endDate = "today"
) => {
  const results = [];
  for (let i = 0; i < metrics.length; i += 1) {
    const metric = parseMetric(metrics[i]);
    results.push(await getMetric(metric, startDate, endDate));
  }

  return results;
};
