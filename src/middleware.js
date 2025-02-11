const base = import.meta.env.BASE_URL.replaceAll('/', '');

/**
 * Adds missing trailing slash to the index url with configured base path in build mode
 * to avoid redirect in the canonical link when deployed
 * @type {import("astro").MiddlewareHandler}
 */
export function onRequest (context, next) {
    const { href } = context.url;

    if (href.endsWith(base)) {
        return context.rewrite(href.concat('/'));
    }

    return next();
};