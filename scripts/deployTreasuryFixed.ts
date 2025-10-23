import { toNano } from '@ton/core';
import { Treasury } from '../contracts/Treasury.tact_Treasury';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const sender = provider.sender();
    const deployer = sender.address!;

    const treasury = provider.open(await Treasury.fromInit(deployer, deployer));

    // Check if already deployed
    if (await provider.isContractDeployed(treasury.address)) {
        ui.write(`Treasury already deployed at: ${treasury.address.toString()}`);
        return;
    }

    // Deploy with Deploy message
    await treasury.send(
        provider,
        sender,
        {
            value: toNano('1.1'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(treasury.address);

    ui.write('Treasury deployed at: ' + treasury.address.toString());
    ui.write('Owner: ' + deployer.toString());
    ui.write('\n📝 Add to .env:');
    ui.write(`TREASURY_CONTRACT_ADDRESS=${treasury.address.toString()}`);
}

