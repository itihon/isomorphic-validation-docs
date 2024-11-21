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
    },
};

const defaultStyle = {
    marginTop: '10px'
};

const host = import.meta.env.DEV ? HOST : PROD_HOST;
const base = addPrefix(BASE_URL, '/');
const appDir = addPrefix(LIVECODES_APP_DIR, '/');
const appUrl = `${host}${base}${appDir}/index.html`;

const Playground = ({ params, config, width, height }) => {
    const style = { ...defaultStyle, width, height };

    const embedOptions = {
        params: {
            ...defaultEmbedOptions.params,
            ...params,
        },
        config: {
            ...defaultEmbedOptions.config,
            ...config,
        },
    };

    return  (
        <div style={style}>
            <LiveCodes 
                appUrl={appUrl}
                config={embedOptions.config} 
                params={embedOptions.params}
                width={width}
                height={height}
            />
        </div>
    );
};

export default Playground;