const express = require('express');
const connectDB = require('./config/db');
const app = express();

// Connect to DB
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req,res) => res.send('API Running'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/logs', require('./routes/api/logs'));
app.use('/api/application', require('./routes/api/application'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/vms', require('./routes/api/vms'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));