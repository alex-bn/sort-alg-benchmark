const express = require('express');
const crypto = require('crypto');
const os = require('os');

const app = express();

app.get('/', (req, res, next) => {
  crypto.pbkdf2('pass', 'salt', 100000, 512, 'sha512', () => {
    res.send('Some workload');
  });
});

app.get('/fast', (req, res) => {
  res.send('Fast route!');
});

app.listen(3000, () => {
  console.log('listening on 3000');
  console.log('threads:', process.env.UV_THREADPOOL_SIZE);
  console.log('cpus:', os.cpus().length);
});
