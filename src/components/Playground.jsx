import LiveCodes from "livecodes/react";
import { useEffect, useState } from "react";
import { LIVECODES_URL } from "../../config.mjs";

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


const Playground = ({
    fileUrls = {}, params, config, width, height, pathPrefix = '/playground',
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
                .map(url => pathPrefix + url)
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
                        appUrl={LIVECODES_URL}
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