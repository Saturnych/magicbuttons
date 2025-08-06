import * as static_private from '$env/static/private';

const ENV = Object.assign(import.meta.env, static_private);

ENV.DEV_MODE = (!!ENV.MODE && ENV.MODE.startsWith('dev')) || ENV.DEV;
ENV.DEBUG = !!ENV.DEV_MODE;
ENV.DEVISION_NUM = 10;

export default ENV;
