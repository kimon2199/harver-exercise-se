let https = require('https');
let images = require('images');
let argv = require('minimist')(process.argv.slice(2));
let Stream = require('stream').Transform; 

let {
    greeting = 'Hello', who = 'You',
    width = 400, height = 500, color = 'Pink', size = 100,
} = argv;

let firstReq = {
// https://cataas.com/cat/says/Hi%20There?width=500&amp;height=800&amp;c=Cyan&amp;s=150
url: 'https://cataas.com/cat/says/' + greeting + '?width=' + width + '&height=' + height + '&color' + color + '&s=' + size, encoding: 'binary'
};

let secondReq = {
    url: 'https://cataas.com/cat/says/' + who + '?width=' + width + '&height=' + height + '&color' + color + '&s=' + size, encoding: 'binary'
};

https.get(firstReq.url, (res) => {
    let data1 = new Stream();
    res.on('data', (data) => {
        data1.push(data);
    });

    res.on('end', () => {
        https.get(secondReq.url, (res) => {
            let data2 = new Stream();   

            res.on('data', (data) => {
                data2.push(data);
            });

            res.on('end', () => {
                images(2*width,height).draw(images(data1.read()),0,0).draw(images(data2.read()), width, 0).save("cat-card.jpg");
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
