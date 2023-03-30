const fs = require('fs');

const default_price = 40000;

const calculateCost = function(options) {
    let result = default_price;

    for (let option of options) {
        switch (option.selectedVar) {
            case 1:
                result += option.price[1];
                break;
            case 2:
                result += option.price[2];
                break;
        }
    }

    return result;
}

const readOptions = function() {
    const options = [];
    const data = fs.readFileSync("./options.txt", { encoding: 'utf8', flag: 'r' });
    const rowArray = data.split('\r\n');

    for (let i = 0; i < rowArray.length; i++) {
        const row = rowArray[i].split(',');
        const option = {
            name: row[0],
            var: [],
            price: [],
            selectedVar: 0
        };

        for (let j = 1; j < row.length; j+=2) {
            option.var.push(row[j]);
            option.price.push(parseInt(row[j+1]));
        }

        options.push(option);
    }

    return options;
}

const getImageName = function(options) {
    let imageName = "";

    for (let option of options) {
        imageName += option.var[option.selectedVar]
    }

    return imageName;
}

const getStringForFile = function(options, email) {
    let result = `email:${email}\n`;

    for (const option of options) {
        result += `${option.name}:${option.var[option.selectedVar]}\n`;
    }

    result += calculateCost(options);

    return result;
}

module.exports = {
    defaultPrice: default_price,
    calculateCost: calculateCost,
    readOptions: readOptions,
    getImageName: getImageName,
    getStringForFile: getStringForFile
};


// const options = {
//     color: {
//         black: 0,
//         white: 500,
//         orange: 1000
//     },
//     bodykit: {
//         stock: 0,
//         medium: 5000,
//         wide: 7500
//     },
//     rims: {
//         stock: 0,
//         bbs: 1000,
//         ro_ja: 4500
//     }
// }