

// Diagnostic: log DEBUG-like env vars (if any) before modification
try {
  const debugVars = Object.keys(process.env).filter(k => k.toUpperCase().startsWith('DEBUG') || k.toUpperCase().includes('DEBUG'));
  if (debugVars.length > 0) {
    console.log('DEBUG env vars present at start:', debugVars.reduce((acc, k) => { acc[k] = process.env[k]; return acc; }, {}));
  }
} catch (e) {}

// Aggressively remove any env var whose value looks like the pathToRegexp error URL
try {
  Object.keys(process.env).forEach(k => {
    const v = (process.env[k] || '').toString();
    if (!v) return;
    const suspicious = ['pathToRegexpError', 'pathToRegexp', 'git.new', '://'];
    for (const s of suspicious) {
      if (v.includes(s)) {
        try { delete process.env[k]; } catch (e) { process.env[k] = ''; }
        break;
      }
    }
  });
} catch (e) {}
require('dotenv').config();
// Defensive: unset DEBUG-like env vars that may contain URLs and break path-to-regexp
try {
  Object.keys(process.env).forEach((k) => {
    if (k.startsWith('DEBUG')) {
      const v = process.env[k] || '';
      if (v.includes('pathToRegexpError') || v.startsWith('http') || v.includes('://')) {
        delete process.env[k];
      }
    }
  });
} catch (e) {
  // ignore
}
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const multer = require('multer');
const validators = require('./validators');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({ dest: uploadsDir + path.sep }); // Configure multer for file uploads

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos de React
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Basic Route
app.get('/api', (req, res) => {
  res.send('Backend de Chorrillos Seguro funcionando!');
});

// Camera Registration Route
app.post('/api/cameras/register', upload.single('imagenReferencial'), async (req, res) => {
  try {
    const {
      nombrePropietario, tipoDocumento, numeroDocumento, telefono, email,
      tipoCamara, modeloCamara, marcaCamara, tieneDVR, zonaVisibilidad,
      grabacion, disposicionCompartir, direccion, lat, lng, sector
    } = req.body;

    // Validate lat/lng server-side
    if (lat && lng && !validators.validateLatLng(lat, lng)) {
      return res.status(400).json({ message: 'Coordenadas inválidas' });
    }

    const imagenReferencial = req.file ? req.file.path.replace(/\\/g, '/') : null;

    const result = await db.query(
      `INSERT INTO cameras (
        nombre_propietario, tipo_documento, numero_documento, telefono, email,
        tipo_camara, modelo_camara, marca_camara, tiene_dvr, zona_visibilidad,
        grabacion, disposicion_compartir, direccion, lat, lng, sector, imagen_referencial
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
      [
        nombrePropietario, tipoDocumento, numeroDocumento, telefono, email,
        tipoCamara, modeloCamara, marcaCamara, tieneDVR, zonaVisibilidad,
        grabacion, disposicionCompartir, direccion, lat, lng, sector, imagenReferencial
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error registering camera:', error);
    res.status(500).json({ message: 'Error registering camera', error: error.message });
  }
});

// Vigilante Registration Route
app.post('/api/vigilantes/register', upload.fields([{ name: 'foto', maxCount: 1 }, { name: 'documentos', maxCount: 10 }]), async (req, res) => {
  try {
    const {
      nombre, apellidos, tipoDocumento, numeroDocumento, fechaNacimiento,
      telefono, email, organizacion, horarioVigilancia, experienciaAnos,
      capacitacionPrevia, tipoCapacitacion, zonaVigilancia, direccion, lat, lng, sector
    } = req.body;

    // Validate lat/lng server-side
    if (lat && lng && !validators.validateLatLng(lat, lng)) {
      return res.status(400).json({ message: 'Coordenadas inválidas' });
    }

    const foto = req.files['foto'] ? req.files['foto'][0].path.replace(/\\/g, '/') : null;
    const documentos = req.files['documentos'] ? req.files['documentos'].map(file => file.path.replace(/\\/g, '/')) : [];

    const result = await db.query(
      `INSERT INTO vigilantes (
        nombre, apellidos, tipo_documento, numero_documento, fecha_nacimiento,
        telefono, email, organizacion, horario_vigilancia, experiencia_anos,
        capacitacion_previa, tipo_capacitacion, zona_vigilancia, direccion, lat, lng, sector,
        foto, documentos
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *`,
      [
        nombre, apellidos, tipoDocumento, numeroDocumento, fechaNacimiento,
        telefono, email, organizacion, horarioVigilancia, experienciaAnos,
        capacitacionPrevia, tipoCapacitacion, zonaVigilancia, direccion, lat, lng, sector,
        foto, documentos
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error registering vigilante:', error);
    res.status(500).json({ message: 'Error registering vigilante', error: error.message });
  }
});

// Helper: delete a file if exists (non-blocking)
function tryUnlink(filePath) {
  if (!filePath) return;
  const p = path.isAbsolute(filePath) ? filePath : path.join(__dirname, filePath);
  fs.unlink(p, (err) => {
    if (err && err.code !== 'ENOENT') console.warn('Failed to delete file', p, err.message);
  });
}

// Cameras: list, detail, delete
app.get('/api/cameras', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const { rows } = await db.query('SELECT * FROM cameras ORDER BY id DESC LIMIT $1 OFFSET $2', [limit, offset]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error listando cámaras' });
  }
});

app.get('/api/cameras/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM cameras WHERE id=$1', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo cámara' });
  }
});

app.delete('/api/cameras/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT imagen_referencial FROM cameras WHERE id=$1', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    const imagePath = rows[0].imagen_referencial;
    await db.query('DELETE FROM cameras WHERE id=$1', [id]);
    if (imagePath) tryUnlink(imagePath);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error borrando cámara' });
  }
});

// Vigilantes: list, detail, delete
app.get('/api/vigilantes', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const { rows } = await db.query('SELECT * FROM vigilantes ORDER BY id DESC LIMIT $1 OFFSET $2', [limit, offset]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error listando vigilantes' });
  }
});

// Simple stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const cam = await db.query('SELECT COUNT(*)::int AS total FROM cameras');
    const vig = await db.query('SELECT COUNT(*)::int AS total FROM vigilantes');
    res.json({ cameras: cam.rows[0].total, vigilantes: vig.rows[0].total });
  } catch (err) {
    console.error('Error getting stats', err);
    res.status(500).json({ error: 'Error fetching stats' });
  }
});

app.get('/api/vigilantes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM vigilantes WHERE id=$1', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo vigilante' });
  }
});

app.delete('/api/vigilantes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT foto, documentos FROM vigilantes WHERE id=$1', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    const { foto, documentos } = rows[0];
    await db.query('DELETE FROM vigilantes WHERE id=$1', [id]);
    if (foto) tryUnlink(foto);
    if (documentos && Array.isArray(documentos)) documentos.forEach(d => tryUnlink(d));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error borrando vigilante' });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
