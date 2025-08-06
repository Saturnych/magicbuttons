import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import mkcert from 'vite-plugin-mkcert';
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation';
import devtoolsJson from 'vite-plugin-devtools-json';
import pkg from './package.json' with { type: 'json' };

//const dev = process.argv.includes('dev');

export default defineConfig({
	plugins: [
		sveltekit(),
		tailwindcss(),
		mkcert(),
		crossOriginIsolation(),
		devtoolsJson() // devtoolsJson({ uuid: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b' }),
	],
	server: {
		https: true,
		proxy: {}
		/*
		headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
		*/
	},
	optimizeDeps: {
		//exclude: ['@sqlite.org/sqlite-wasm']
	},
	define: {
		__NAME__: `"${pkg.name}"`,
		__TITLE__: `"${pkg.title}"`,
		__DESC__: `"${pkg.description}"`,
		__HOMEPAGE__: `"${pkg.homepage}"`,
		__REPO__: `"${pkg.repository?.url}"`,
		__AUTHORNAME__: `"${pkg.author?.name}"`,
		__AUTHOREMAIL__: `"${pkg.author?.email}"`
	}
});
