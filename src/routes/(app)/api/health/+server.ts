import type { ServerLoadEvent, RequestHandler, Response } from '@sveltejs/kit';
import { returnJson } from '$lib/utils';

export const GET: RequestHandler = async (event: ServerLoadEvent): Response =>
	returnJson({ healthy: true });
