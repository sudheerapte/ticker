"use strict";

function err(msg) {
  if (msg === false) {
    console.log(`*** test returned false ***`); process.exit(1);
  } else if (typeof msg === 'string') {
    console.log(`*** ${msg} ***`); process.exit(1);
  }
}

module.exports = [ err ];
