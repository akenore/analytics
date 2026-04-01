const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const { subDays, format, parse, isAfter, isBefore } = require('date-fns');

const env = fs.readFileSync('.env', 'utf8');
const match = env.match(/GOOGLE_SERVICE_ACCOUNT_KEY='(.+?)'/s);
const creds = JSON.parse(match[1]);
creds.private_key = creds.private_key.replace(/\\n/g, '\n');

const storage = new Storage({ credentials: creds, projectId: creds.project_id });
const BUCKET = 'pubsite_prod_5254145672693010255';
const PKG = 'com.fielmedina.sousse';

async function run() {
  const days = 90;
  const since = subDays(new Date(), days);
  const until = new Date();

  console.log('Since:', format(since, 'yyyy-MM-dd'));
  console.log('Until:', format(until, 'yyyy-MM-dd'));

  const months = new Set();
  let cursor = new Date(since);
  while (cursor <= until) {
    months.add(format(cursor, 'yyyyMM'));
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }
  console.log('Months:', [...months]);

  for (const month of months) {
    const path = `stats/installs/installs_${PKG}_${month}_overview.csv`;
    try {
      const [content] = await storage.bucket(BUCKET).file(path).download();
      const csv = content.toString('utf-8').replace(/^\ufeff/, '');
      const lines = csv.split('\n');
      console.log(`\n${path}: ${lines.length - 1} rows`);

      let count = 0;
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(',');
        const dateStr = cols[0];
        const installs = parseInt(cols[2] || '0', 10);
        const rowDate = parse(dateStr, 'yyyy-MM-dd', new Date());
        if (isAfter(rowDate, since) && isBefore(rowDate, until)) {
          count++;
          if (count <= 5) console.log(`  ${dateStr}: ${installs} installs`);
        }
      }
      console.log(`  Total matching days: ${count}`);
    } catch (e) {
      console.log(`${path}: NOT FOUND (${e.code || e.message})`);
    }
  }
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
