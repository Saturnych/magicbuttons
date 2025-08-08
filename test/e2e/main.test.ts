import { expect, test, type Page } from '@playwright/test';
import { config } from 'dotenv';
import { isDivisible, isNumeric, sleep } from '../../src/lib/utils';
import pkg from '../../package.json' with { type: 'json' };

const TIMEOUT = 3000;
const TIMEOUTLONG = 5000;
const TIMEOUTVERYLONG = 60000;
const MAXRETRIES = 10;
const DEBUG = process.env.NODE_ENV !== 'production';

if (DEBUG) config({ quiet: true });
const {
	PUBLIC_APP_URL,
	PRIVATE_VERCEL_TEAM_ID = null,
	PRIVATE_VERCEL_TOKEN = null,
	SHA = null
} = process.env;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

test.describe.configure({ mode: 'serial' });

let page: Page;
let link: string;

const getDeployments = async (request): Promise<object[]> => {
	if (!PRIVATE_VERCEL_TEAM_ID) return null;
	// https://vercel.com/docs/rest-api/reference/endpoints/deployments/list-deployments
	const response = await request.get(
		`https://api.vercel.com/v6/deployments?teamId=${PRIVATE_VERCEL_TEAM_ID}`,
		{
			headers: {
				Authorization: !!PRIVATE_VERCEL_TOKEN ? `Bearer ${PRIVATE_VERCEL_TOKEN}` : undefined,
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		}
	);
	console.log('response.ok():', response.ok());
	console.log('response.status():', response.status());
	if (response.ok() && Number(response.status()) === 200) {
		const result = await response.json();
		return result?.deployments;
	} else return null;
};

test.beforeAll(async ({ browser, request }) => {
	console.log('SHA:', SHA);
	console.log('PUBLIC_APP_URL:', PUBLIC_APP_URL);
	await sleep(TIMEOUTLONG);
	let done: boolean = false;
	let retried: number = 0;
	while (!done) {
		if (retried > MAXRETRIES) {
			done = true;
		} else {
			const deployments = await getDeployments(request);
			if (deployments?.length > 0) {
				const deployment: object = deployments[0];
				console.log('deployment.state:', deployment.state);
				console.log('deployment.githubCommitSha:', deployment.meta.githubCommitSha);
				const date: Date = new Date(new Date().toISOString());
				const spentSec: number = isNumeric(deployment.buildingAt)
					? Math.round((date.getTime() - Number(deployment.buildingAt)) / 1000)
					: null;
				console.log(
					'deployment.buildingAt:',
					deployment.buildingAt,
					'deployment.ready:',
					deployment.ready,
					'spent:',
					spentSec
				);
				if (
					((SHA && SHA === deployment.meta.githubCommitSha) || DEBUG) &&
					deployment.state === 'READY'
				) {
					done = true;
				} else {
					retried++;
					const timeout: number = deployment.state === 'QUEUED' ? TIMEOUTVERYLONG : TIMEOUTLONG;
					await sleep(timeout);
				}
			}
		}
	}

	page = await browser.newPage();
});

test.afterAll(async () => {
	if (page) await page.close();
	console.log('Done with e2e tests');
});

test('e2e page check', async () => {
	test.slow();
	await sleep(TIMEOUT);
	await page.goto(PUBLIC_APP_URL, { waitUntil: 'domcontentloaded' });
	//console.log(page.workers());
	const title = await page.title();
	await expect(title).toBe(pkg.title);
	const h1 = page.locator('h1');
	await expect(h1).toBeVisible();
	const h2 = page.locator('h2');
	await expect(h2).toBeVisible();
	const h3 = page.locator('h3');
	await expect(h3).toBeVisible();

	await sleep(TIMEOUT);
	const h2text = await h2.textContent();
	console.log('h2text:', h2text);
	await expect(isNumeric(h2text)).toBeTruthy();
	const h3text = await h3.textContent();
	console.log('h3text:', h3text);
	await expect(isNumeric(h3text)).toBeTruthy();
	const divisible: boolean = isDivisible(Number(h2text), Number(h3text));
	console.log('divisible:', divisible);
	const button = page.locator('button');
	if (divisible) {
		await expect(button).toBeVisible();
	} else {
		await expect(button).not.toBeVisible();
	}
});
