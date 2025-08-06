//import { env } from '$env/dynamic/public';
import * as static_public from '$env/static/public';

const ENV = Object.assign(import.meta.env, static_public);

export const NODE_ENV: string = ENV.NODE_ENV || ENV.VITE_USER_NODE_ENV || ENV.MODE || '';
export const DEV_MODE: boolean = (!!NODE_ENV && NODE_ENV.startsWith('dev')) || ENV.DEV;
export const DEBUG: boolean = !!DEV_MODE;
export const SSR: boolean = !!ENV.SSR;
export const BASE_URL: string = ENV.BASE_URL || '/';
export const APP_NAME: string = ENV.PUBLIC_APP_NAME || 'app';
export const APP_DOMAIN: string = ENV.PUBLIC_APP_DOMAIN || null;
export const APP_URL: string = ENV.PUBLIC_APP_URL || null;
export const EVENTS_URI: string = ENV.PUBLIC_EVENTS_URI || null;
