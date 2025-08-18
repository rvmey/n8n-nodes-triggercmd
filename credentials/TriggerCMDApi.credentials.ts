import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TriggerCMDApi implements ICredentialType {
	name = 'triggercmdApi';
	displayName = 'TriggerCMD API';
	documentationUrl = 'https://docs.triggercmd.com';
	properties: INodeProperties[] = [
		{
			displayName: 'Token',
			name: 'apiToken',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			}
		},
	];

	// This allows the credential to be used by other parts of n8n
	// stating how this credential is injected as part of the request
	// An example is the Http Request node that can make generic calls
	// reusing this credential
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.apiToken}}',
			},
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://triggercmd.com',
			url: '/api/computer/list',
		},
	};
}
