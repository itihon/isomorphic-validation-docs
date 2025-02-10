import path from 'path';
import { readFile, writeFile, readdirSync, statSync } from 'node:fs';

let shouldUpdate = process.argv.includes('--write');

function findFileByExt(base,ext,files,result) 
{
    files = files || readdirSync(base) 
    result = result || [] 

    files.forEach( 
        function (file) {
            var newbase = path.join(base,file)
            if ( statSync(newbase).isDirectory() )
            {
                result = findFileByExt(newbase,ext,readdirSync(newbase),result)
            }
            else
            {
                if ( file.substr(-1*(ext.length+1)) == '.' + ext )
                {
                    result.push(newbase)
                } 
            }
        }
    )
    return result
}

const filesList = findFileByExt('src/content/docs','mdx');

const regex = /\[.*?\]\((\/.*?)\)/g;

const updateFile = (fileName = '') => readFile(fileName, (err, data) => {
    if (err) throw err;

    const strData = data.toString();

    const strResult = strData.replaceAll(regex, (match, link, ...rest) => {
        const [path, anchor] = link.split('#');
        
        const modifiedLink = '/'.concat(
            path.split('/').filter(value => value !== '').join('/').concat('/')
        ).concat(anchor ? `#${anchor}` : '');

        if (link !== modifiedLink) {
            console.log(`${fileName}:`, match, '-->', modifiedLink);
        }

        return match.replace(link, modifiedLink);
    });

    if (strData !== strResult && shouldUpdate) {
        writeFile(fileName, strResult, (err) => {
            if (err) throw err;

            console.log(`${fileName}: The file  has been updated.`);
        });
    }
});

filesList.forEach(updateFile);