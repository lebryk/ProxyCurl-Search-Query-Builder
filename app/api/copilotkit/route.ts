import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import { NextRequest } from 'next/server';
import { langGraphPlatformEndpoint } from '@copilotkit/runtime'; 
import { env } from 'process';
 
const serviceAdapter = new OpenAIAdapter();

  const runtime = new CopilotRuntime({
    remoteEndpoints: [
      langGraphPlatformEndpoint({
        deploymentUrl: "http://localhost:8001",
        langsmithApiKey: env.LANGSMITH_API_KEY as string,
        agents: [{ 
          name: 'research_canvas', 
          description: 'A Serach Qury Builder that helping search best candidates for job'
        },
        { 
          name: 'agent', 
          description: 'A Serach Qury Builder that helping search best candidates for job #2'
        }]
      }),
    ],
});
 
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit',
  });
 
  return handleRequest(req);
};