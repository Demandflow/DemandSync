import { config } from 'dotenv';
import { ClickUpService } from './clickup';

config();

async function main() {
    try {
        if (!process.env.CLICKUP_API_KEY) {
            throw new Error('CLICKUP_API_KEY environment variable is required');
        }

        const workspaceId = '9015007933';
        console.log('Using workspace ID:', workspaceId);

        const clickUpService = new ClickUpService(process.env.CLICKUP_API_KEY, workspaceId);
        await clickUpService.syncStatusesWithClickUp();

        console.log('Test completed successfully');
    } catch (error) {
        console.error('Error during test:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

main(); 