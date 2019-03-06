// https://www.npmjs.com/package/levee
// https://www.npmjs.com/package/wreck

import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';

import { Bundles } from '../lib/Bundles';
import { get } from 'lodash';

import { Levee } from 'levee';
import { Wreck } from 'wreck';
 
var options, circuit;
 
options = {
    maxFailures: 5,
    timeout: 60000,
    resetTimeout: 30000
};

function fallback(url, callback) {
  callback(null, null, new Buffer('The requested website is not available. Please try again later.'));
}

//---------------------------------------
// Circuit Breaker Monitoring
// // Print stats every 5 seconds.
// setInterval(function () {
//   console.log(stats.snapshot());
//   console.log(fbStats.snapshot());
// }, 5000);

Bundles.after.insert(function (userId, doc) {

  // // HIPAA Audit Log
  // HipaaLogger.logEvent({eventType: "create", userId: userId, userName: '', collectionName: "Bundles"});

  // RELAY/SEND FUNCTIONALITY
  // interface needs to be active in order to send the messages
  if (get(Meteor, 'settings.public.interfaces.default.status') === "active") {

    // https://www.npmjs.com/package/levee

    circuit = Levee.createBreaker(service, options);
    circuit.fallback = Levee.createBreaker(fallback, options);

    circuit.on('timeout', function () {
      console.log('Request timed out.');
    });

    circuit.on('failure', function (err) {
      console.log('Request failed.', err);
    });

    var endpoint = get(Meteor, 'settings.public.interfaces.default.channel.endpoint');
    circuit.run(endpoint, function (err, req, payload) {
      // If the service fails or timeouts occur 5 consecutive times,
      // the breaker opens, fast failing subsequent requests.
      console.log(err || payload);
    });

    var stats, fbStats;
    stats = Levee.createStats(circuit);
    fbStats = Levee.createStats(circuit.fallback);


    // HTTP.put( + '/Patient', {
    //   data: doc
    // }, function(error, result){
    //   if (error) {
    //     console.log("POST /Patient", error);
    //   }
    //   if (result) {
    //     console.log("POST /Patient", result);
    //   }
    // });
  }
});
Bundles.after.update(function (userId, doc) {
  // // HIPAA Audit Log
  // HipaaLogger.logEvent({eventType: "update", userId: userId, userName: '', collectionName: "Bundles"});

  // ...
});
Bundles.after.remove(function (userId, doc) {
  // ...
});
