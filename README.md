# 🛡️ Chorrillos Seguro

Plataforma web de empadronamiento de cámaras y vigilantes vecinales para fortalecer la seguridad ciudadana en el distrito de Chorrillos.

## 🎯 Objetivo Principal

Crear un sitio web responsive, accesible y estéticamente alineado con la identidad de la Municipalidad de Chorrillos, que permita:

- **Registro público** de cámaras privadas (vecinales y de comercios) y vigilantes privados vecinales
- **Visualización georreferenciada** en mapa interactivo (solo para usuarios autorizados)
- **Historial de incidencias** por punto y exportación KML
- **Gestión interna** (validación, credenciales, reportes) a través de un panel administrativo

## 🚀 Características Principales

### ✨ Frontend (React.js + Tailwind CSS)
- **Diseño responsive** "mobile-first" que escala a tablets/desktop
- **Colores institucionales** de Chorrillos: azul (#005fa8), blanco (#ffffff), dorado (#e8b400)
- **Tipografía profesional** (Poppins, Roboto)
- **Componentes reutilizables** y accesibles

### 🗺️ Mapa Interactivo
- **Integración Leaflet.js** para visualización geográfica
- **Marcadores personalizados** para cámaras y vigilantes
- **Filtros avanzados** por tipo, sector y estado
- **Popups informativos** con datos detallados
- **Historial de incidencias** integrado

### 📝 Formularios de Empadronamiento
- **Empadronamiento de Cámaras**: Formulario de 3 pasos con validación
- **Empadronamiento de Vigilantes**: Registro completo con documentos
- **Validación en tiempo real** y manejo de errores
- **Subida de archivos** (imágenes, PDFs)

### 🔐 Panel Administrativo
- **Dashboard estadístico** con métricas clave
- **Gestión de registros** pendientes de validación
- **Solicitudes de imágenes** y seguimiento
- **Exportación KML** para sistemas SIG
- **Gestión de usuarios** y roles

### 🆘 Centro de Ayuda
- **FAQs organizadas** por categorías
- **Manual de usuario** descargable
- **Chat en vivo** integrado
- **Calendario de eventos** y capacitaciones

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React.js 19** - Biblioteca de interfaz de usuario
- **Tailwind CSS** - Framework CSS utilitario
- **React Router** - Enrutamiento de la aplicación
- **Heroicons** - Iconografía moderna
- **Leaflet.js** - Mapeo interactivo

### Backend (En desarrollo)
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **PostgreSQL + PostGIS** - Base de datos espacial
- **JWT** - Autenticación segura

## 📱 Páginas y Funcionalidades

### 🏠 Página Principal (Home)
- Banner institucional con logo de Chorrillos
- CTAs principales para empadronamiento
- Sección de beneficios del sistema
- Marco legal y normativas vigentes

### 📹 Empadronamiento de Cámaras
- **Paso 1**: Datos del propietario
- **Paso 2**: Características de la cámara
- **Paso 3**: Ubicación y georreferenciación
- Generación de código QR para edición futura

### 🛡️ Empadronamiento de Vigilantes
- **Paso 1**: Datos personales
- **Paso 2**: Información de vigilancia
- **Paso 3**: Ubicación y documentos
- Generación de credencial digital

### 🗺️ Mapa Interactivo
- Visualización de todos los puntos registrados
- Filtros por tipo, sector y estado
- Información detallada en popups
- Historial de incidencias por punto
- Solicitud de imágenes (solo autoridades)

### ⚙️ Panel Administrativo
- **Dashboard**: Estadísticas y métricas
- **Registros**: Validación de empadronamientos
- **Solicitudes**: Gestión de peticiones de imágenes
- **Exportación**: KML, Excel y PDF

### ❓ Centro de Ayuda
- FAQs organizadas por categorías
- Manual de usuario descargable
- Chat de soporte en vivo
- Calendario de eventos

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/gerenciasc2022/CHORRILLOS-SEGURO.git
cd CHORRILLOS-SEGURO
```

2. **Instalar dependencias del frontend**
```bash
cd frontend
npm install
```

3. **Instalar dependencias del backend**
```bash
cd ../backend
npm install
```

4. **Configurar variables de entorno**
```bash
# En backend/.env
PORT=3001
DATABASE_URL=postgresql://usuario:password@localhost:5432/chorrillos_seguro
JWT_SECRET=tu_secreto_jwt
```

5. **Ejecutar el proyecto**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## 📊 Estructura del Proyecto

```
CHORRILLOS-SEGURO/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   │   ├── layout/      # Navbar, Footer
│   │   │   └── pages/       # Páginas principales
│   │   ├── App.js           # Componente principal
│   │   └── index.css        # Estilos con Tailwind
│   ├── tailwind.config.js   # Configuración de Tailwind
│   └── package.json
├── backend/                  # Servidor Node.js
│   ├── index.js             # Servidor principal
│   └── package.json
└── README.md
```

## 🎨 Guía de Estilos

### Paleta de Colores
- **Azul Chorrillos**: `#005fa8` - Color principal institucional
- **Blanco**: `#ffffff` - Fondos y texto sobre azul
- **Dorado**: `#e8b400` - Acentos y elementos destacados
- **Azul Oscuro**: `#1a365d` - Footer y elementos secundarios

### Tipografía
- **Poppins** - Títulos y encabezados
- **Roboto** - Texto del cuerpo y elementos de interfaz

### Componentes
- **Botones**: Primarios (azul), secundarios (dorado), outline (bordes)
- **Tarjetas**: Sombras suaves, bordes redondeados
- **Formularios**: Validación visual, estados de error
- **Mapa**: Marcadores personalizados, popups informativos

## 🔒 Seguridad y Privacidad

- **Autenticación JWT** para acceso administrativo
- **Roles y permisos** diferenciados por usuario
- **Validación de datos** en frontend y backend
- **Protección de información** personal de los usuarios
- **Cumplimiento** de normativas de protección de datos

## 📋 Checklist de Desarrollo

### ✅ Completado
- [x] Estructura del proyecto React
- [x] Diseño UI/UX con Tailwind CSS
- [x] Componentes de layout (Navbar, Footer)
- [x] Página principal (Home)
- [x] Formulario de empadronamiento de cámaras
- [x] Formulario de empadronamiento de vigilantes
- [x] Mapa interactivo con Leaflet
- [x] Centro de ayuda con FAQs
- [x] Panel administrativo básico

### 🚧 En Desarrollo
- [ ] Backend con Node.js/Express
- [ ] Base de datos PostgreSQL + PostGIS
- [ ] Autenticación JWT
- [ ] API endpoints para formularios
- [ ] Generación de códigos QR
- [ ] Exportación KML real

### 📋 Pendiente
- [ ] Testing y QA
- [ ] Optimización de rendimiento
- [ ] Despliegue en producción
- [ ] Documentación técnica completa
- [ ] Capacitación de usuarios

## 🤝 Contribución

Este proyecto es desarrollado para la **Municipalidad de Chorrillos** y el **CODISEC**. Para contribuir:

1. Fork del repositorio
2. Crear rama para nueva funcionalidad
3. Commit de cambios
4. Push a la rama
5. Crear Pull Request

## 📞 Contacto

- **Municipalidad de Chorrillos**
- **Dirección**: Av. Defensores del Morro 100
- **Teléfono**: (01) 254-0000
- **Email**: info@chorrillos.gob.pe
- **Web**: www.chorrillos.gob.pe

## 📄 Licencia

Este proyecto es propiedad de la **Municipalidad de Chorrillos** y se desarrolla bajo las normativas de seguridad ciudadana vigentes.

---

**Desarrollado con ❤️ para la seguridad de Chorrillos**