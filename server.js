const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JSON_FILE = path.join(__dirname, 'tenants_data.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Get all tenants
app.get('/api/tenants', async (req, res) => {
  try {
    const data = await fs.readFile(JSON_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read tenants' });
  }
});

// Get tenant by ID
app.get('/api/tenants/:id', async (req, res) => {
  try {
    const data = await fs.readFile(JSON_FILE, 'utf8');
    const jsonData = JSON.parse(data);
    const tenant = jsonData.tenants.find(t => t.tenant_id === req.params.id);
    if (tenant) {
      res.json(tenant);
    } else {
      res.status(404).json({ error: 'Tenant not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to read tenant' });
  }
});

// Add tenant
app.post('/api/tenants', async (req, res) => {
  try {
    const data = await fs.readFile(JSON_FILE, 'utf8');
    const jsonData = JSON.parse(data);
    jsonData.tenants.push(req.body);
    await fs.writeFile(JSON_FILE, JSON.stringify(jsonData, null, 2));
    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save tenant' });
  }
});

// Update tenant
app.put('/api/tenants/:id', async (req, res) => {
  try {
    const data = await fs.readFile(JSON_FILE, 'utf8');
    let jsonData = JSON.parse(data);
    jsonData.tenants = jsonData.tenants.map(tenant =>
      tenant.tenant_id === req.params.id ? req.body : tenant
    );
    await fs.writeFile(JSON_FILE, JSON.stringify(jsonData, null, 2));
    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tenant' });
  }
});

// Delete tenant
app.delete('/api/tenants/:id', async (req, res) => {
  try {
    const data = await fs.readFile(JSON_FILE, 'utf8');
    let jsonData = JSON.parse(data);
    jsonData.tenants = jsonData.tenants.filter(tenant => tenant.tenant_id !== req.params.id);
    await fs.writeFile(JSON_FILE, JSON.stringify(jsonData, null, 2));
    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tenant' });
  }
});

// Get all extras
app.get('/api/extras', async (req, res) => {
  try {
    const data = await fs.readFile(JSON_FILE, 'utf8');
    const jsonData = JSON.parse(data);
    res.json(jsonData.extras);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read extras' });
  }
});

// Get extra by ID
app.get('/api/extras/:id', async (req, res) => {
  try {
    const data = await fs.readFile(JSON_FILE, 'utf8');
    const jsonData = JSON.parse(data);
    const extra = jsonData.extras.find(e => e.extra_id === req.params.id);
    if (extra) {
      res.json(extra);
    } else {
      res.status(404).json({ error: 'Extra not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to read extra' });
  }
});

// Add extra
app.post('/api/extras', async (req, res) => {
  try {
    const data = await fs.readFile(JSON_FILE, 'utf8');
    const jsonData = JSON.parse(data);
    jsonData.extras.push(req.body);
    await fs.writeFile(JSON_FILE, JSON.stringify(jsonData, null, 2));
    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save extra' });
  }
});

// Update extra
app.put('/api/extras/:id', async (req, res) => {
  try {
    const data = await fs.readFile(JSON_FILE, 'utf8');
    let jsonData = JSON.parse(data);
    jsonData.extras = jsonData.extras.map(extra =>
      extra.extra_id === req.params.id ? req.body : extra
    );
    await fs.writeFile(JSON_FILE, JSON.stringify(jsonData, null, 2));
    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update extra' });
  }
});

// Delete extra
app.delete('/api/extras/:id', async (req, res) => {
  try {
    const data = await fs.readFile(JSON_FILE, 'utf8');
    let jsonData = JSON.parse(data);
    jsonData.extras = jsonData.extras.filter(extra => extra.extra_id !== req.params.id);
    await fs.writeFile(JSON_FILE, JSON.stringify(jsonData, null, 2));
    res.json({ status: 'success' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete extra' });
  }
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});