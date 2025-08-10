const express = require('express');
const path = require('path');
const app = express();
const port = 4200;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .container { max-width: 800px; margin: 0 auto; }
            h1 { color: #333; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Application is Running</h1>
            <p>Your web application is now functional and running on port ${port}.</p>
            <p>Time: ${new Date().toLocaleString()}</p>
        </div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(\`Server running at http://localhost:\${port}\`);
});