const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/apod', async (req, res) => {
    const { date, dateFrom, count } = req.query;
    const paramCount = [date, dateFrom, count].filter(param => param !== undefined).length;

    if (paramCount > 1) {
        return res.status(400).json({ error: 'error parametres' });
    }

    await axios.get('https://api.nasa.gov/planetary/apod', {
        params: {
            date: date || undefined,
            start_date: dateFrom || undefined,
            count: count || undefined,
            api_key: process.env.NASA_API_KEY,
        },
    }).then(response => {
        res.json(response.data);
    });
});

app.get('/mars', async (req, res) => {
    const { date, option, camera } = req.query
    await axios.get('https://api.nasa.gov/mars-photos/api/v1/rovers/' + option + '/photos', {
        params: {
            earth_date: date,
            camera: camera === 'all' ? undefined : camera,
            api_key: process.env.NASA_API_KEY,
        }
    }).then(response => {
        res.json(response.data)
    })
})

app.get('/epic', async (req, res) => {
    const { date, option } = req.query;
    const imgData = [];
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);

    if (option == "natural") {
        const naturalData = await axios.get('https://api.nasa.gov/EPIC/api/natural/date/' + year + '-' + month + '-' + day + '/', {
            params: {
                api_key: process.env.NASA_API_KEY,
            },
        });
        naturalData.data.forEach(data => {
            const imageUrl = 'https://epic.gsfc.nasa.gov/archive/natural/' + year + '/' + month + '/' + day + '/png/' + data.image + '.png'
            imgData.push({
                date: data.date,
                caption: data.caption,
                imageUrl: imageUrl,
            })
        });
        res.json(imgData);
    } else {
        const enhancedData = await axios.get('https://api.nasa.gov/EPIC/api/enhanced/date/' + year + '-' + month + '-' + day + '/', {
            params: {
                api_key: process.env.NASA_API_KEY,
            },
        });

        enhancedData.data.forEach(data => {
            const imageUrl = 'https://epic.gsfc.nasa.gov/archive/enhanced/' + year + '/' + month + '/' + day + '/png/' + data.image + '.png'
            imgData.push({
                date: data.date,
                caption: data.caption,
                imageUrl: imageUrl,
            })
        });
        res.json(imgData);
    }
})

app.get('/neoWs', async (req, res) => {
    const { startDate, endDate } = req.query
    await axios.get('https://api.nasa.gov/neo/rest/v1/feed', {
        params: {
            start_date: startDate,
            end_date: endDate,
            api_key: process.env.NASA_API_KEY,
        }
    }).then(response => {
        res.json(response.data)
    })

})

app.get('/history', async (req, res) => {
    const { text, mediaType } = req.query
    await axios.get('https://images-api.nasa.gov/search', {
        params: {
            q: text,
            page:1,
            media_type: mediaType
        }
    }).then(response => {
        res.json(response.data)
    })
})



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
