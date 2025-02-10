const base = import.meta.env.BASE_URL.replaceAll('/', '');

/**
 * Adds missing trailing slash to the url with configured base path in build mode
 * to avoid redirect in the canonical link when deployed
 * @type {import("astro").MiddlewareHandler}
 */
export function onRequest (context, next) {

    if (context.url.pathname.endsWith(base)) {
        return context.rewrite(context.url.href.concat('/'));
    }

    return next();
};