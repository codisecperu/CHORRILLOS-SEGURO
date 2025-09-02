const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
// Load .env for local development so DATABASE_URL is available
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'postgresql://pguser:pgpass@localhost:5432/chor_db';
console.log('Using DB connection string:', connectionString.replace(/:[^:@]+@/, ':***@'));

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function waitForDb(retries = 10, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      client.release();
      return;
    } catch (err) {
      console.log(`DB not ready yet (attempt ${i + 1}/${retries}), retrying in ${delayMs}ms...`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error('Database did not become available in time');
}

async function runMigrations() {
  try {
  console.log('Running database migrations...');
  // wait longer during container startup
  await waitForDb(30, 2000);
    const client = await pool.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS cameras (
        id SERIAL PRIMARY KEY,
        nombre_propietario VARCHAR(255) NOT NULL,
        tipo_documento VARCHAR(50),
        numero_documento VARCHAR(100) NOT NULL,
        telefono VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        tipo_camara VARCHAR(100),
        modelo_camara VARCHAR(255),
        marca_camara VARCHAR(255),
        tiene_dvr BOOLEAN,
        zona_visibilidad TEXT,
        grabacion BOOLEAN,
        disposicion_compartir BOOLEAN,
        direccion TEXT NOT NULL,
        lat DECIMAL(10, 8),
        lng DECIMAL(11, 8),
        sector VARCHAR(100) NOT NULL,
        imagen_referencial VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS vigilantes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        apellidos VARCHAR(255) NOT NULL,
        tipo_documento VARCHAR(50),
        numero_documento VARCHAR(100) NOT NULL,
        fecha_nacimiento DATE NOT NULL,
        telefono VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        organizacion VARCHAR(255),
        horario_vigilancia VARCHAR(255),
        experiencia_anos VARCHAR(50),
        capacitacion_previa BOOLEAN,
        tipo_capacitacion TEXT,
        zona_vigilancia TEXT,
        direccion TEXT NOT NULL,
        lat DECIMAL(10, 8),
        lng DECIMAL(11, 8),
        sector VARCHAR(100) NOT NULL,
        foto VARCHAR(255),
        documentos TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS solicitudes_imagenes (
        id SERIAL PRIMARY KEY,
        camara_id INTEGER REFERENCES cameras(id),
        solicitante_id INTEGER REFERENCES users(id),
        motivo TEXT NOT NULL,
        estado VARCHAR(50) DEFAULT 'pendiente',
        fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    pool.end();
  }
}

runMigrations();