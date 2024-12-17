import LiveCodes from "livecodes/react";
import { LIVECODES_APP_DIR, HOST, PROD_HOST, BASE_URL } from "../../config.mjs";
import { addPrefix } from "../utils/utils";

/** @typedef {import('livecodes').EmbedOptions} LifecodesParams*/

/** @type {LifecodesParams} */
const defaultEmbedOptions = {
    params: {
        console: 'open',
        compiled: 'none',
        loading: 'lazy',
    },
    config: {
        activeEditor: 'script',
        script: {
            language: 'javascript',
        },
        markup: {
            language: 'html',
        },
        style: {
            language: 'css',
        },
    },
};

const defaultStyle = {
    marginTop: '10px'
};

const host = import.meta.env.DEV ? HOST : PROD_HOST;
const base = addPrefix(BASE_URL, '/');
const appDir = addPrefix(LIVECODES_APP_DIR, '/');
const appUrl = `${host}${base}${appDir}/index.html`;

const Playground = ({ params = {}, config = {}, width, height }) => {
    const style = { ...defaultStyle, width, height };

    // override prefilling through query params with prefilling through the config property
    const { js, html, css, ...restParams } = params;
    
    /** @type {LifecodesParams} */
    const embedOptions = {
        params: {
            ...defaultEmbedOptions.params,
            ...restParams,
        },
        config: {
            ...defaultEmbedOptions.config,
            ...config,
        },
    };

    const mergedConfig = embedOptions.config;
    const mergedParams = embedOptions.params;

    mergedConfig.script.content = mergedConfig.script.content || js;
    mergedConfig.markup.content = mergedConfig.markup.content || html;
    mergedConfig.style.content =  mergedConfig.style.content  || css;

    return  (
        <div style={style}>
            <LiveCodes 
                appUrl={appUrl}
                config={mergedConfig} 
                params={mergedParams}
                width={width}
                height={height}
            />
        </div>
    );
};

export default Playground;