import { request } from '@playwright/test';
import { config } from '../../config/env.config';
export async function loginViaApi(email: string, password: string) {
const ctx = await request.newContext({ baseURL: config.apiUrl });
const res = await ctx.post('/api/auth/login', { data: { email, password } });
return res.json(); // returns token / session
}