import { visit } from 'unist-util-visit';
import { isRootRelativeURL, addPrefix } from './src/utils/utils.js';

export default function baseUrlModifierRemarkPlugin({ basePath = '/' }) {

    const base = addPrefix(basePath, '/');

    const isUrlContainingType = (node) => 
        ['link', 'image'].some(type => type === node.type);

    // there may be url containing tags in mdx files
    const getUrlContainingHtmlAttribute = (node) => 
        ['src', 'href'].map(
          attrName => Array.from(Object(node.attributes)).filter(
            ({name, value}) => name === attrName && typeof value === 'string'
          )[0]
        )[0];

    return function (tree, file) {
        const { hero } = file.data.astro.frontmatter;

        if (hero) {
            const { actions, image } = hero;

            if (image) {
                const { file } = image;
                if (isRootRelativeURL(file)) {
                    image.file = addPrefix(file, base);
                }
            }

            if (actions) {
                actions.forEach(action => {
                    const { link } = action;
                    if (isRootRelativeURL(link)) {
                        action.link = addPrefix(link, base);
                    }
                });
            }
        }

        visit(tree, (node) => {

            if (isUrlContainingType(node)) {
                const { url } = node;

                if (url) {
                    if (isRootRelativeURL(url)) {
                        node.url = addPrefix(url, base);
                        return;
                    }
                }
            }

            let attr = getUrlContainingHtmlAttribute(node);
            if (attr) {
                const { value } = attr;

                if (value) {
                    if (isRootRelativeURL(value)) {
                        attr.value = addPrefix(value, base);
                    }
                }
            }
        });
    };
};