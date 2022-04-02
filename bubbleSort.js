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

  function bubbleSort(array) {
    swapped = true;

    while (swapped) {
      swapped = false;
      for (let i = 0; i < array.length; i++) {
        let left = array[i];
        let right = array[i + 1];

        if (left > right) {
          array[i] = right;
          array[i + 1] = left;
          swapped = true;
        }
      }
    }
    return array;
  }

  app.get('/', (req, res, next) => {
    const testArray = [];
    const length = 100000;

    for (let i = 0; i < length; i++) {
      testArray.push(Math.floor(Math.random() * 100000));
    }

    bubbleSort(testArray);
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
Time taken for tests:   29.451 seconds
Complete requests:      1
Failed requests:        0
Total transferred:      212 bytes
HTML transferred:       13 bytes
Requests per second:    0.03 [#/sec] (mean)
Time per request:       29450.808 [ms] (mean)
Time per request:       29450.808 [ms] (mean, across all concurrent requests)
Transfer rate:          0.01 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.0      0       0
Processing: 29451 29451   0.0  29451   29451
Waiting:    29450 29450   0.0  29450   29450
Total:      29451 29451   0.0  29451   29451

*/
