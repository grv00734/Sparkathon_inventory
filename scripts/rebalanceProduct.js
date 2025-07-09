// scripts/rebalanceProducts.js

import { exec } from 'child_process';
import path from 'path';

const pythonScript = path.resolve('ml-engine/rebalance.py');

exec(`python ${pythonScript}`, (error, stdout, stderr) => {
  if (error) {
    console.error('Error running rebalance script:', error.message);
    return;
  }
  if (stderr) {
    console.error('STDERR:', stderr);
  }
  console.log('Rebalance complete:\n', stdout);
});
