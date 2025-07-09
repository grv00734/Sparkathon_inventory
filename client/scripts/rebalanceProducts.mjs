import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure __dirname is available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pythonScript = path.resolve(__dirname, '../ml-engine/rebalance.py');

exec(`python "${pythonScript}"`, (error, stdout, stderr) => {
  if (error) {
    console.error('Error running rebalance script:', error.message);
    return;
  }
  if (stderr) {
    console.error('STDERR:', stderr);
  }
  console.log('Rebalance complete:\n', stdout);
});