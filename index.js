import { defaultPrice, readOptions, getImageName, calculateCost, getStringForFile } from './myFunctions.js';
import { writeFile } from 'fs';
import express from 'express';
import { Liquid } from 'liquidjs';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;

app.use(express.static('./'));

const engine = new Liquid(); // register liquid engine
app.engine('liquid', engine.express());
app.set('views', './views'); // specify the views directory
app.set('view engine', 'liquid');

app.use(bodyParser.urlencoded({
    extended: true
}));

const defaultOptions = readOptions();
const options = defaultOptions;

app.get('/', (req, res) => {
    res.render('home', {
        cost: defaultPrice,
        options: defaultOptions,
        imageName: getImageName(defaultOptions),
    });

    console.log(new Date());
});

app.post('/', (req, res) => {

    for (let i in req.body) {
        for (let option of options) {
            if (option.name == i) {
                console.log(option.name, '==', i);
                option.selectedVar = parseInt(req.body[i]);
                console.log(req.body[i], option);
            }
        }
    }

    const set = {
        cost: calculateCost(options),
        options,
        imageName: getImageName(options)
    };

    if (req.body.save) {
        const curDate = new Date();
        const strDate = `${curDate.getMonth()}-${curDate.getDay()}-${curDate.getFullYear()}_${curDate.getHours()}-${curDate.getMinutes()}-${curDate.getSeconds()}`;
        const cleanEmail = (req.body.email).replace(/[^a-z0-9]/gi, "");
        const fileName = `${cleanEmail}_${strDate}.txt`;

        const data = getStringForFile(options, req.body.email);
        writeFile('C:/Projects/back/Task 2/orders/' + fileName, data, (err) => {
            if (err) {
                console.error(err);
                set.alert = 'Ошибка при оформлении заказа, попробуйте позже';
            }
            else {
                set.alert = 'Заказ успешно оформлен';
            }
            res.render('home', set);
        });
    } else {
        res.render('home', set);
    }

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});