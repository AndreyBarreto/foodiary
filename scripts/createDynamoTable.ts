import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';
import { readFileSync } from 'fs';
import { parse } from 'yaml';

const yamlContent = readFileSync('./sls/resources/MainTable.yml', 'utf8');
const config = parse(yamlContent);

const tableConfig = config.Resources.MainTable.Properties;

const client = new DynamoDBClient({
    endpoint: 'http://localhost:8000',
});

async function createTable() {
    console.log('🚀 Creating MainTable...');

    const params = {
        ...tableConfig,
        TableName: 'foodiary-local-MainTable'
    };

    try {
        const command = new CreateTableCommand(params);
        await client.send(command);
        console.log('✅ Table created successfully!');
    } catch (error) {
        if (error instanceof Error && error.name === 'ResourceInUseException') {
            console.log('⚠️  Table already exists!');
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

createTable();
