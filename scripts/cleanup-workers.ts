import { deleteWorker, listWorkers } from '@cloudflare/workers-sdk';

async function main() {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

  // Only manage these specific workers
  const boltEchoWorkers = [
    'bolt-echo',           // Main deployment
    'bolt-echo-tail',      // Tail deployment
    'marduk-bolt',         // Marduk integration
    'bolt-cog'            // Cog deployment
  ];

  // Define which ones to keep
  const keepWorkers = [
    'bolt-echo',           // Main production worker
    'bolt-echo-staging',   // Staging environment
    'marduk-bolt',         // Keep Marduk integration
    'bolt-cog'            // Keep Cog deployment
  ];

  try {
    const workers = await listWorkers({
      apiToken,
      accountId,
    });

    console.log('Analyzing bolt-echo related workers...');
    
    for (const worker of workers) {
      // Only process bolt-echo related workers
      if (boltEchoWorkers.includes(worker.name)) {
        if (!keepWorkers.includes(worker.name)) {
          console.log(`\nRemoving worker: ${worker.name}`);
          try {
            await deleteWorker({
              apiToken,
              accountId,
              name: worker.name,
            });
            console.log(`Successfully removed ${worker.name}`);
          } catch (error) {
            console.error(`Error removing ${worker.name}:`, error);
          }
        } else {
          console.log(`\nKeeping worker: ${worker.name}`);
        }
      } else {
        console.log(`\nSkipping non-bolt-echo worker: ${worker.name}`);
      }
    }

    console.log('\nCleanup complete! Current bolt-echo deployments:');
    const remainingWorkers = await listWorkers({ apiToken, accountId });
    remainingWorkers
      .filter(w => boltEchoWorkers.includes(w.name))
      .forEach(w => {
        console.log(`- ${w.name}`);
        console.log(`  Status: ${w.latest_deployment?.status}`);
        console.log(`  Routes: ${w.routes?.map(r => r.pattern).join(', ') || 'No routes'}`);
        console.log('---');
      });
  } catch (error) {
    console.error('Error managing workers:', error);
  }
}

main();
