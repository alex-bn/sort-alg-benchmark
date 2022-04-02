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

  function insertionSort(array) {
    for (let i = 1; i < array.length; i++) {
      let j = i - 1;
      let current = array[i];

      while (j >= 0 && array[j] > current) {
        array[j + 1] = array[j];
        j--;
      }
      array[j + 1] = current;
    }
    return array;
  }

  app.get('/', (req, res, next) => {
    const testArray = [];
    const length = 100000;

    for (let i = 0; i < length; i++) {
      testArray.push(Math.floor(Math.random() * 100000));
    }

    insertionSort(testArray);
    res.send('Some workload');
  });

  app.listen(3000, () => {
    console.log('listening on 3000');
    console.log('threads:', process.env.UV_THREADPOOL_SIZE);
  });
}

/*

$ ab -c 1 -n 1 localhost:3000/

Concurrency Level:      1
Time taken for tests:   1.974 seconds
Complete requests:      1
Failed requests:        0
Total transferred:      212 bytes
HTML transferred:       13 bytes
Requests per second:    0.51 [#/sec] (mean)
Time per request:       1973.547 [ms] (mean)
Time per request:       1973.547 [ms] (mean, across all concurrent requests)
Transfer rate:          0.10 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.0      0       0
Processing:  1973 1973   0.0   1973    1973
Waiting:     1972 1972   0.0   1972    1972
Total:       1974 1974   0.0   1974    1974

*/
