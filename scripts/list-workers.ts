import { listWorkers } from '@cloudflare/workers-sdk';

async function main() {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  
  // Workers we're interested in
  const boltEchoWorkers = [
    'bolt-echo',
    'bolt-echo-tail',
    'marduk-bolt',
    'bolt-cog'
  ];

  try {
    const workers = await listWorkers({
      apiToken,
      accountId,
    });

    console.log('All Workers:');
    workers.forEach(worker => {
      const isBoltEcho = boltEchoWorkers.includes(worker.name);
      console.log(`\nName: ${worker.name}${isBoltEcho ? ' (bolt-echo related)' : ''}`);
      console.log(`Status: ${worker.latest_deployment?.status}`);
      console.log(`Routes: ${worker.routes?.map(r => r.pattern).join(', ') || 'No routes'}`);
      if (worker.pages_deployment) {
        console.log(`Pages Project: ${worker.pages_deployment.project_name}`);
        console.log(`Pages URL: ${worker.pages_deployment.url}`);
      }
      console.log('---');
    });

    // Summary of bolt-echo deployments
    console.log('\nBolt Echo Related Deployments:');
    const boltWorkers = workers.filter(w => boltEchoWorkers.includes(w.name));
    console.log(`Total: ${boltWorkers.length}`);
    boltWorkers.forEach(w => console.log(`- ${w.name}`));
  } catch (error) {
    console.error('Error listing workers:', error);
  }
}

main();
