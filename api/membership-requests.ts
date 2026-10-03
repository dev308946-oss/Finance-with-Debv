import type { IncomingMessage, ServerResponse } from 'http';
import submitHandler, { config as submitConfig } from './membership/submit.ts';

export const config = submitConfig;

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  return submitHandler(req, res);
}
