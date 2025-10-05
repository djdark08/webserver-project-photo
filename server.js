const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const http = require('http'); // For WebSocket server
const WebSocket = require('ws');

const app = express();
const PORT = 3000;
const UPLOAD_DIR = 'uploads';

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(express.static(path.join(__dirname, 'public')));

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// HTTP server (needed for WebSocket)
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
});

// Function to broadcast to all clients
function broadcastReload() {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('reload');
        }
    });
}

// Routes
app.get('/', (req, res) => {
    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) return res.status(500).send('Error reading upload directory.');
        const mediaFiles = files.filter(file => /\.(jpg|jpeg|png|gif|mp4|mov|avi|webm)$/i.test(file));
        res.render('index', { mediaFiles });
    });
});

app.post('/upload', upload.array('media', 10), (req, res) => {
    if (!req.files?.length) return res.status(400).send('No files uploaded.');
    broadcastReload(); // notify all clients to reload
    res.redirect('/');
});

app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, UPLOAD_DIR, req.params.filename);
    if (fs.existsSync(filePath)) res.download(filePath);
    else res.status(404).send('File not found.');
});

app.post('/delete/:filename', (req, res) => {
    const filePath = path.join(__dirname, UPLOAD_DIR, req.params.filename);
    fs.unlink(filePath, err => {
        if (err) return res.status(500).send('Error deleting file.');
        broadcastReload(); // notify all clients to reload
        res.redirect('/');
    });
});

// Start server
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
