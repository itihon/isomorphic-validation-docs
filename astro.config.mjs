import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import baseUrlModifierRemarkPlugin from './base-links-remark-plugin.mjs';
import { BASE_URL, PROD_HOST } from './config.mjs';

// override favicon for production so it is eligible to be shown in google search results
const head = import.meta.env.PROD
    ?  [{
        tag: 'link',
        attrs: {
            rel: 'icon',
            href: `${PROD_HOST}/isomorphic-validation-docs-favicon.svg`,
            type: 'image/svg+xml',
        },
    }]
    : undefined;

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
            favicon: '/favicon.svg',
            head,
            title: 'Isomorphic javascript validation library',
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
                    label: 'Getting started',
                    link: '/getting-started/',
                },
                {
                    label: 'Concept',
                    autogenerate: { directory: 'concept' },
                },
                {
                    label: 'Examples',
                    items: [
                        {
                            label: 'Sign-up and sign-in forms validation',
                            link: '/api/validation/static-methods/profile/#examples',
                        },
                        {
                            label: 'Validating password and password confirmation',
                            link: '/api/validation/static-methods/glue/#validating-password-and-password-confirmation',
                        },
                        {
                            label: 'Validating one field depending on another',
                            link: '/api/validation/static-methods/glue/#validating-one-field-depending-on-another',
                        },
                        {
                            label: 'Optional (not required) field',
                            link: '/api/validation/constructor/#parameter-optional',
                        },
                        {
                            label: 'Conditional execution of predicates',
                            link: '/api/validation/instance-methods/constraint/#parameter-next',
                        },
                        {
                            label: 'Internationalized validation error messages with i18next',
                            link: '/api/validation/instance-methods/constraint/#parameter-anydata',
                        },
                        {
                            label: 'Prevent input of certain characters',
                            link: '/api/validation/instance-methods/constraint/#parameter-keepvalid',
                        },
                        {
                            label: 'Validating file metadata before uploading to S3 storage',
                            link: '/api/validation/instance-methods/datamapper/#validating-file-metadata-before-uploading-to-s3-storage',
                        },
                        {
                            label: 'Sign-up and sign-in forms client and server side validation with Express',
                            link: 'https://github.com/itihon/signup_signin_example',
                        },
                    ],
                },
                {
                    label: 'API',
                    items: [
                        {
                            label: 'Validation',
                            items: [
                                {
                                    label: 'Validation() constructor',
                                    link: '/api/validation/constructor/',
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
                                    label: 'Predicate() constructor',
                                    link: '/api/predicate/constructor/',
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
                            link: '/api/validation-result/',
                        },
                        {
                            label: 'UI',
                            items: [
                                {
                                    label: 'Helper functions',
                                    autogenerate: { directory: 'api/ui/helper-functions'}
                                },
                                {
                                    label: 'Renderer functions',
                                    autogenerate: { directory: 'api/ui/renderer-functions'}
                                },
                                {
                                    label: 'Effect functions',
                                    autogenerate: { directory: 'api/ui/effect-functions'}
                                },
                            ],
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