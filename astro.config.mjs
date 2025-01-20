import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
// import mdx from '@astrojs/mdx';
import baseUrlModifierRemarkPlugin from './base-links-remark-plugin.mjs';
import { BASE_URL, PROD_HOST } from './config.mjs';

// https://astro.build/config
export default defineConfig({
    site: PROD_HOST,
    base: BASE_URL,
    markdown: {
        remarkPlugins: [ 
            [baseUrlModifierRemarkPlugin, { basePath: BASE_URL }],
        ],
    },
    integrations: [
        starlight({
            title: 'Isomorphic validation javascript library',
            logo: {
                src: '/public/lib-logo.svg',
                alt: 'Isomorphic validation javascript library',
            },
            defaultLocale: 'root', // optional
            locales: {
                root: {
                    label: 'English',
                    lang: 'en', // lang is required for root locales
                },
            },
            social: {
                github: 'https://github.com/itihon/isomorphic-validation',
            },
            editLink: {
                baseUrl: 'https://github.com/itihon/isomorphic-validation-docs/edit/main',
            },
            components: {
                Hero: './src/components/Hero.astro',
                PageSidebar: './src/components/PageSidebar.astro',
                SiteTitle: './src/components/SiteTitle.astro',
            },
            credits: true,
            sidebar: [
                {
                    slug: 'getting-started',
                },
                {
                    label: 'Concept',
                    autogenerate: { directory: 'concept' },
                },
                {
                    label: 'API',
                    items: [
                        {
                            label: 'Validation',
                            items: [
                                {
                                    slug: 'api/validation/constructor'
                                },
                                {
                                    label: 'Instance methods',
                                    autogenerate: { directory: 'api/validation/instance-methods'}
                                },
                                {
                                    label: 'Instance properties',
                                    autogenerate: { directory: 'api/validation/instance-properties'}
                                },
                                {
                                    label: 'Static methods',
                                    autogenerate: { directory: 'api/validation/static-methods'}
                                },
                                {
                                    label: 'Callable object',
                                    autogenerate: { directory: 'api/validation/callable-object'}
                                },
                            ],
                        },
                        {
                            label: 'Predicate',
                            items: [
                                {
                                    slug: 'api/predicate/constructor'
                                },
                                {
                                    label: 'Instance methods',
                                    autogenerate: { directory: 'api/predicate/instance-methods'}
                                },
                                {
                                    label: 'Instance properties',
                                    autogenerate: { directory: 'api/predicate/instance-properties'}
                                },
                            ],
                        },
                        {
                            label: 'ValidationResult',
                            slug: 'api/validation-result',
                        },
                    ],
                },
                {
                    label: 'Examples',
                    items: [
                        {
                            label: 'Isomorphic sign-up and sign-in forms validation with vanilla JS and Express',
                            slug: 'getting-started',
                        },
                        {
                            label: 'Isomorphic sign-up and sign-in forms validation with React and Express',
                            slug: 'getting-started',
                        },
                        {
                            label: 'Isomorphic file meta data validation',
                            slug: 'getting-started',
                        },
                        {
                            label: 'Validation messages with i18n',
                            slug: 'getting-started',
                        },
                        {
                            label: 'Usage with the ValidatorJS library',
                            slug: 'getting-started',
                        },
                    ],
                },
            ],
		}), 
        react(),
        // this overrides mdx integration with added remark plugins in @astrojs/starlight/index.ts
        // starlightAsides in particular
        // mdx({
        //     remarkPlugins: [ 
        //         [baseUrlModifierRemarkPlugin, { basePath: BASE_URL }],
        //     ],
        // }),
    ],
});