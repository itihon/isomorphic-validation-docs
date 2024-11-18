import { visit } from 'unist-util-visit';

export default function baseUrlModifierRemarkPlugin({ basePath = '/' }) {

    const base = basePath.replace('/', '').padStart(basePath.length + 1, '/');

    const isRelativeURL = (value = '') => value.startsWith('/');
    const hasBaseUrl = (value = '') => new RegExp(`^${base}`).test(value);
    const isUrlContainingType = (node) => 
        ['link', 'image'].some(type => type === node.type);

    return function (tree, file) {
        const { hero } = file.data.astro.frontmatter;

        if (hero) {
            const { actions, image } = hero;

            if (image) {
                const { file } = image;
                if (isRelativeURL(file) && !hasBaseUrl(file)) {
                    image.file = `${base}${file}`;
                }
            }

            if (actions) {
                actions.forEach(action => {
                    const { link } = action;
                    if (isRelativeURL(link) && !hasBaseUrl(link)) {
                        action.link = `${base}${link}`;
                    }
                });
            }
        }

        visit(tree, (node) => {

            if (isUrlContainingType(node)) {
                const { url } = node;

                if (url) {
                    if (isRelativeURL(url) && !hasBaseUrl(url)) {
                        node.url = `${base}${url}`;
                    }
                }
            }
        });
    };
};