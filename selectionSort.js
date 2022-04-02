process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require('cluster');

if (cluster.isMaster) {
  cluster.fork();
  // cluster.fork();
  // cluster.fork();
  // cluster.fork();
  // cluster.fork();
  // cluster.fork();
} else {
  const express = require('express');
  const os = require('os');

  const app = express();
  console.log('cpus:', os.cpus().length);

  function selectionSort(array) {
    for (let i = 0; i < array.length; i++) {
      let minimum = i;

      for (let j = i + 1; j < array.length; j++) {
        if (array[j] < array[minimum]) {
          minimum = j;
        }
      }

      let v1 = array[i];
      let v2 = array[minimum];

      array[i] = v2;
      array[minimum] = v1;
    }
    return array;
  }

  app.get('/', (req, res, next) => {
    const testArray = [];
    const length = 100000;

    for (let i = 0; i < length; i++) {
      testArray.push(Math.floor(Math.random() * 100000));
    }

    selectionSort(testArray);
    res.send('Some workload');
  });

  app.listen(3000, () => {
    console.log('listening on 3000');
    console.log('threads:', process.env.UV_THREADPOOL_SIZE);
  });
}

/*

Test result:
$ ab -c 1 -n 1 localhost:3000/

Concurrency Level:      1
Time taken for tests:   5.036 seconds
Complete requests:      1
Failed requests:        0
Total transferred:      212 bytes
HTML transferred:       13 bytes
Requests per second:    0.20 [#/sec] (mean)
Time per request:       5036.422 [ms] (mean)
Time per request:       5036.422 [ms] (mean, across all concurrent requests)
Transfer rate:          0.04 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.0      0       0
Processing:  5036 5036   0.0   5036    5036
Waiting:     5035 5035   0.0   5035    5035
Total:       5036 5036   0.0   5036    5036

*/
