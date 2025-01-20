import { visit } from 'unist-util-visit';
import { isRootRelativeURL, addPrefix } from './src/utils/utils.js';

export default function baseUrlModifierRemarkPlugin({ basePath = '/' }) {

    const base = addPrefix(basePath, '/');

    const isUrlContainingType = (node) => 
        ['link', 'image'].some(type => type === node.type);

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
                    }
                }
            }
        });
    };
};