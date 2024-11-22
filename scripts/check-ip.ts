import https from 'https';

function getPublicIP() {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function checkIP() {
  try {
    const ip = await getPublicIP();
    console.log('Your public IP:', ip);
    console.log('Make sure this IP is whitelisted in MongoDB Atlas');
  } catch (error) {
    console.error('Error getting IP:', error);
  }
}

checkIP(); 