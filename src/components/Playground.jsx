import LiveCodes from "livecodes/react";
import { useEffect, useState } from "react";
import { 
    LIVECODES_EXAMPLES_DIR, 
    LIVECODES_APP_DIR, HOST, 
    PROD_HOST, BASE_URL 
} from "../../config.mjs";
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

const host = import.meta.env.DEV ? HOST : PROD_HOST;
const base = addPrefix(BASE_URL, '/');
const appDir = addPrefix(LIVECODES_APP_DIR, '/');
const examplesDir = addPrefix(LIVECODES_EXAMPLES_DIR, '/');
const appUrl = `${host}${base}${appDir}/index.html`;

const Playground = ({
    fileUrls = {}, params, config, width, height,
}) => {
    const [state, setState] = useState(<div>Playground</div>);
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

    useEffect(() => {
        Promise.all(
            Object.values(fileUrls)
                .map(relUrl => base + examplesDir + relUrl)
                .map(url => fetch(url))
                .map(req => req.then(res => res.text()))
        ).then(resArr => resArr.forEach(
            (fileContent, idx) => {
                embedOptions.params[[Object.keys(fileUrls)[idx]]] = fileContent;
            }
        )).then(() => {
            setState(
                <>
                    <br />
                    <LiveCodes 
                        appUrl={appUrl}
                        config={embedOptions.config} 
                        params={embedOptions.params}
                        width={width}
                        height={height}
                    />
                </>
            );
        });
            
    }, []);

    return state;
};

export default Playground;