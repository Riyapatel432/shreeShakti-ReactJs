const fs = require('fs');
const path = require('path');

const backendDir = 'D:\\\\shreeShakti\\\\Node_shreeShakti';

if (!fs.existsSync(backendDir)) fs.mkdirSync(backendDir, { recursive: true });
if (!fs.existsSync(path.join(backendDir, 'models'))) fs.mkdirSync(path.join(backendDir, 'models'));
if (!fs.existsSync(path.join(backendDir, 'routes'))) fs.mkdirSync(path.join(backendDir, 'routes'));

const serverJs = `const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shreeshakti_erp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
`;

const authJs = `const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if it's the default static admin (for development)
    if (email === 'admin@shreeshakti.com' && password === 'password123') {
      const token = jwt.sign({ id: 'admin123', role: 'Admin' }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
      return res.json({ token, user: { name: 'S. S. Sharma', email, role: 'Admin' } });
    }

    // Check database
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    // Compare password (plain text check for simplicity, normally use bcrypt)
    // const isMatch = await bcrypt.compare(password, admin.password);
    if (password !== admin.password) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, role: 'Admin' }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
    res.json({ token, user: { name: admin.name, email: admin.email, role: 'Admin' } });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
`;

const adminJs = `const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('Admin', adminSchema);
`;

const envFile = `PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shreeshakti_erp
JWT_SECRET=supersecretkey_shreeshakti
`;

fs.writeFileSync(path.join(backendDir, 'server.js'), serverJs);
fs.writeFileSync(path.join(backendDir, 'routes', 'auth.js'), authJs);
fs.writeFileSync(path.join(backendDir, 'models', 'Admin.js'), adminJs);
fs.writeFileSync(path.join(backendDir, '.env'), envFile);

console.log('Backend files generated successfully.');
