const fs = require('fs');
const path = require('path');

const saveJson = (obj, mCB, mName = 'users', minify = false) =>
{
    let json;

    if (minify)
    {
        json = JSON.stringify(obj);
    }
    else
    {
        json = JSON.stringify(obj, null, 4);
    }

    const outputPath = path.resolve(
        `../src/components/Scene3D/data/${mName}.js`
    );

    fs.writeFile(outputPath, 'export default ' +json, 'utf8', mCB);
};

module.exports = saveJson;
