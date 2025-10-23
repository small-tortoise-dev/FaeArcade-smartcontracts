import { toNano, Address } from '@ton/core';
import { Treasury } from '../contracts/Treasury.tact_Treasury';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const sender = provider.sender();
    
    // Use the existing contract address from the image
    const contractAddress = Address.parse('0QDh6iEi4In21bwzJ_Ro5Oy2SZG81w4KsE--K1seArBvsZE4');
    const treasury = provider.open(Treasury.fromAddress(contractAddress));
    
    ui.write('Opening room on existing contract...');
    ui.write('Contract address: ' + contractAddress.toString());
    
    try {
        // Try to open the room
        await treasury.send(
            sender,
            {
                value: toNano('0.1'), // Gas fee
            },
            "open_room"
        );
        
        ui.write('✅ Room open transaction sent successfully!');
        ui.write('Please check your wallet to confirm the transaction.');
        
    } catch (error: any) {
        ui.write('❌ Failed to open room: ' + error.message);
        
        if (error.message.includes('Room already exists')) {
            ui.write('ℹ️  Room is already open, you can now try to enter it.');
        }
    }
}
