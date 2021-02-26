const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

//configure static folder
app.use(express.static(path.join(__dirname, "build")));

app.use(bodyParser.json());

// const vapidKeys = webpush.generateVAPIDKeys();
// const publicKey = vapidKeys.publicKey;
// const privateKey = vapidKeys.privateKey;

//put this in env var
const publicKey = 'BBGXhrBKp5kzHpAHjZwIRTKvHihvER2qyVYuiUaBALmWvu9qOL1lGztXqr6BDfb2HefNGZegRC0wsRxbokJikLA';
const privateKey = 'jsrwhMphuj8qQ0H7I-kBUurdKfxeSL7VZ9aqr0PJim8';

webpush.setVapidDetails(
    'mailto:admin@example.org',
    publicKey,
    privateKey
);

// Subscribe Route
app.post('/subscribe', (req, res) => {
    // get subscription obj
    const sub = req.body;

    // Send 201 - resource created sucessfully
    res.status(201).json({});

    //Create payload
    const payload = JSON.stringify({title: 'Push Test'});

    // pass obj into sendNotification
    webpush.sendNotification(sub, payload).catch(err => console.log(err))
});

const port = 5000;
app.listen(port, () => console.log("Server started on port ", port));