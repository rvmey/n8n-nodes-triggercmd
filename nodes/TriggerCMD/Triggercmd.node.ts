import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
    NodeConnectionType,
	NodeOperationError,
    IHttpRequestMethods,
} from 'n8n-workflow';

export class TriggerCMD implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TriggerCMD',
		name: 'triggercmd',
		icon: 'file:triggercmd.svg',
		group: ['automation'],
		version: 1,
		description: 'Run a command on a computer.',
		defaults: {
			name: 'TriggerCMD',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'triggercmdApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Computer Name',
				name: 'computerName',
				type: 'string',
				default: '',
				required: true,
				description: 'The name of the computer to run the command on',
			},
			{
				displayName: 'Trigger Name',
				name: 'commandName',
				type: 'string',
				default: '',
				required: true,
				description: 'The name of the command to execute',
			},
			{
				displayName: 'Parameters',
				name: 'parameters',
				type: 'string',
				default: '',
				description: 'Optional parameters for the command',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const credentials = await this.getCredentials('triggercmdApi');
				if (!credentials) {
					throw new NodeOperationError(this.getNode(), 'Credentials not found.');
				}

				const computerName = this.getNodeParameter('computerName', i) as string;
				const commandName = this.getNodeParameter('commandName', i) as string;
				const parameters = this.getNodeParameter('parameters', i) as string;
				const apiToken = credentials.apiToken as string;

				const url = `https://www.triggercmd.com/api/run/trigger`;
				
				const options = {
					method: 'POST' as IHttpRequestMethods,
					uri: url,
					qs: {
						params: parameters,
						computer: computerName,
						trigger: commandName,
					},
					headers: {
						Authorization: `Bearer ${apiToken}`,
					},
					json: true,
				};

				const response = await this.helpers.request(options);

				returnData.push({
					json: response,
					binary: {},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						binary: {},
					});
				} else {
					throw error;
				}
			}
		}

		return this.prepareOutputData(returnData);
	}
}