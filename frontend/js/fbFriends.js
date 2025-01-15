const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Token dostępu - wymaga autoryzacji użytkownika
const accessToken = 'c542194693e5b32f2044282fb38c4307'; // Wstaw token dostępu

// Endpoint API Facebooka
const facebookApiUrl = 'https://graph.facebook.com/v12.0/me/friends';

// Endpoint serwera do wywołania API Facebooka
app.get('/friends', (req, res) => {
    const options = {
        url: facebookApiUrl,
        qs: {
            access_token: accessToken
        }
    };

    // Wywołanie API Graph Facebooka
    request.get(options, (error, response, body) => {
        if (error) {
            console.error('Błąd w wywołaniu API:', error);
            res.status(500).send('Błąd w wywołaniu API.');
        } else {
            const data = JSON.parse(body);
            res.status(200).json({
                message: 'Lista znajomych pobrana pomyślnie.',
                friends: data.data // Zawiera listę znajomych
            });
        }
    });
});

// Uruchomienie serwera
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
