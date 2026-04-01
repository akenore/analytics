const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const match = env.match(/GOOGLE_SERVICE_ACCOUNT_KEY='(.+?)'/s);
const creds = JSON.parse(match[1]);
creds.private_key = creds.private_key.replace(/\\n/g, '\n');

const storage = new Storage({ credentials: creds, projectId: creds.project_id });

storage.bucket('pubsite_prod_5254145672693010255')
  .file('stats/installs/installs_com.fielmedina.sousse_202603_overview.csv')
  .download()
  .then(([content]) => {
    let text;
    if (content.length > 2 && content[1] === 0) {
      text = content.toString('utf16le');
    } else {
      text = content.toString('utf-8');
    }
    text = text.replace(/^\ufeff/, '').replace(/^\xef\xbb\xbf/, '');
    
    let map = new Map();
    const lines = text.split('\n');
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(',');
        const dateStr = cols[0].trim();
        const installs = parseInt(cols[2] || '0', 10);
        if (i === 1) { console.log('Raw col0:', Buffer.from(cols[0], 'utf-8')); console.log('col0 string:', cols[0]); }
        if (dateStr >= '2026-01-01' && dateStr <= '2026-04-01') {
            map.set(dateStr, installs);
        }
    }
    console.log('Sample data parsed:');
    let c = 0;
    for (let [k, v] of map) {
        c++;
        if (c <= 3) console.log(k, v);
    }
    console.log('Total entries:', map.size);
    process.exit(0);
  });
