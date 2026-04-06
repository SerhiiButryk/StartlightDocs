// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Tankard 🍺 Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/SerhiiButryk/StartlightDocs' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						
						// Each item here is one entry in the navigation menu.
						{ label: 'Miscellaneous links', slug: 'guides/dev_links' },
						{ label: 'Unix tools', slug: 'guides/dev_doc' },
						{ label: 'Encoding (Charsets)', slug: 'guides/encoding_doc' },
						{ label: 'Andoid apk debugging', slug: 'guides/android_apk_inspect' },

					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
	site: 'https://serhiibutryk.github.io/StartlightDocs',
	base: '/StartlightDocs',
});
