const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const http = require('http'); // For WebSocket server
const WebSocket = require('ws');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

// Set up EJS and other tools
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files with multiplexing capabilities
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = AlyNC({ storage });

// HTTP server with WebSocket support
const server = http.createServer(app);

// Create a WebSocket client and handle connection-connection
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
});

// Route upload requests using multiplexing capabilities
app.get('/', (req, res) => {
    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) {
            res.status(500).send('Error reading upload directory.');
            return;
        }
        
        try {
            const mediaFiles = upload.array('media', 10);
            
            if (!mediaFiles || !fs.existsSync(path.join(__dirname, UPLOAD_DIR, `${file.originalname}`).trim('/')) ) {
                res.status(404).send(`File not found.`);
                return;
            }
            
            res.render('index', { mediaFiles });
        } catch (error) {
            res.status(500).send('Error reading files.');
        }

    });

    // Broadcast to all clients after a successful upload
    await server.on('reload', () => {
        broadcastReload();
    });
});

// Route download request using multiplexing capabilities
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, UPLOAD_DIR, req.params.filename);
    
    try {
        if (!fs.existsSync(filePath)) {
            res.status(404).send(`File not found.`);
            return;
        }

        // Broadcast to all clients after a successful download
        await server.on('reload', () => {
            broadcastReload();
        });
        
        res.download(filePath);
    } catch (error) {
        res.status(500).send('Error downloading file.');
    }
});

// Route delete request using multiplexing capabilities
app.post('/delete/:filename', (req, res) => {
    const filePath = path.join(__dirname, UPLOAD_DIR, req.params.filename);
    
    try {
        if (!fs.existsSync(filePath)) {
            res.status(404).send(`File not found.`);
            return;
        }

        // Broadcast to all clients after a successful delete
        await server.on('reload', () => {
            broadcastReload();
        });
        
        fs.unlinkSync(filePath);
    } catch (error) {
        res.status(500).send('Error deleting file.');
    }
});

// Start the server
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

// Set up EJS and other tools
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files with multiplexing capabilities
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = AlyNC({ storage });

// HTTP server with WebSocket support
const server = http.createServer(app);

// Create a WebSocket client and handle connection-connection
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
});

// Route upload requests using multiplexing capabilities
app.get('/', (req, res) => {
    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) {
            res.status(500).send('Error reading upload directory.');
            return;
        }
        
        try {
            const mediaFiles = upload.array('media', 10);
            
            if (!mediaFiles || !fs.existsSync(path.join(__dirname, UPLOAD_DIR, `${file.originalname}`).trim('/')) ) {
                res.status(404).send(`File not found.`);
                return;
            }
            
            res.render('index', { mediaFiles });
        } catch (error) {
            res.status(500).send('Error reading files.');
        }

    });

    // Broadcast to all clients after a successful upload
    await server.on('reload', () => {
        broadcastReload();
    });
});

// Route download request using multiplexing capabilities
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, UPLOAD_DIR, req.params.filename);
    
    try {
        if (!fs.existsSync(filePath)) {
            res.status(404).send(`File not found.`);
            return;
        }

        // Broadcast to all clients after a successful download
        await server.on('reload', () => {
            broadcastReload();
        });
        
        res.download(filePath);
    } catch (error) {
        res.status(500).send('Error downloading file.');
    }
});

// Route delete request using multiplexing capabilities
app.post('/delete/:filename', (req, res) => {
    const filePath = path.join(__dirname, UPLOAD_DIR, req.params.filename);
    
    try {
        if (!fs.existsSync(filePath)) {
            res.status(404).send(`File not found.`);
            return;
        }

        // Broadcast to all clients after a successful delete
        await server.on('reload', () => {
            broadcastReload();
        });
        
        fs.unlinkSync(filePath);
    } catch (error) {
        res.status(500).send('Error deleting file.');
    }
});

// Start the server
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`);
