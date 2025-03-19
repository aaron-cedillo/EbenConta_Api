📦 Dependencias principales

📌 Core del Proyecto:
Node.js (Entorno de ejecución de JavaScript)
Express → express@4.18.2 (Framework para manejar rutas y peticiones HTTP)

📌 Instalación: npm install express
📌 Base de Datos:
mssql → mssql@9.1.1 (Cliente para conectar con SQL Server)

📌 Instalación: npm install mssql
🔐 Seguridad y Autenticación:
jsonwebtoken (JWT) → jsonwebtoken@9.0.2 (Autenticación con tokens)

📌 Instalación: npm install jsonwebtoken
bcrypt → bcrypt@5.1.1 (Para cifrar contraseñas)

📌 Instalación: npm install bcrypt
dotenv → dotenv@16.4.4 (Para manejar variables de entorno)
📌 Instalación: npm install dotenv

🔍 Herramientas de Desarrollo:
nodemon → nodemon@3.0.3 (Reinicia el servidor automáticamente en cambios)
📌 Instalación: npm install nodemon -D

📂 Estructura del Proyecto
📁 Backend (api/)
/config/ → Configuración de la conexión a SQL Server
/controllers/ → Controladores para manejar la lógica de negocio
/middlewares/ → Middlewares para autenticación y validaciones
/routes/ → Rutas de la API
/server.js → Archivo principal que levanta el servidor

📌 Funcionalidades de la API
✅ Usuarios:
✔️ Registro y autenticación con JWT.
✔️ Cifrado de contraseñas con bcrypt.
✔️ Renovación de token para mantener la sesión activa.

✅ Administradores:
✔️ Gestión de contadores (crear, editar, eliminar).
✔️ Consulta de contadores con fecha de expiración.

✅ Contadores:
✔️ Gestión de clientes (crear, editar, eliminar).
✔️ Subida de archivos XML para facturación.
✔️ Consulta y exportación de facturas.
✔️ Alertas de vencimiento.

✅ Seguridad:
✔️ Middleware para proteger rutas con JWT.
✔️ Tokens que expiran después de 1 hora de inactividad.
✔️ Si el usuario sigue activo, el token se renueva automáticamente.

✅ Ejecución:
Para ejecutar la api, usar el comando node server.js

📌 Configuración de la Base de Datos
1️⃣ Editar el archivo .env
Crea un archivo .env en la raíz del proyecto y agrega la JWT_SECRET=mi_clave_secreta, recomendable para mayor seguridad mover la conexion a la bd al archivo .env
En este caso se maneja en la carpeta /config/ se pueden cambiar los datos ahi pero para mayor seguridad y mejores practicas manejarlo en el archivo.env

2️⃣ Estructura de la base de datos en sql server

CREATE DATABASE EbenConta

Use EbenConta

CREATE TABLE Usuarios (
    UsuarioID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Correo NVARCHAR(150) NOT NULL UNIQUE,
    Contrasena NVARCHAR(255) NOT NULL, 
    Rol NVARCHAR(50) NOT NULL,
    FechaRegistro DATETIME DEFAULT GETDATE()
	FechaExpiracion DATETIME NULL
);

ALTER TABLE Usuarios
ADD CONSTRAINT chk_Rol CHECK (Rol IN ('admin', 'contador'));

CREATE TABLE Clientes (
    ClienteID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(150) NOT NULL,
    RFC NVARCHAR(13) NOT NULL UNIQUE,
    Correo NVARCHAR(150),
    Telefono NVARCHAR(15),
    Direccion NVARCHAR(255),
    UsuarioID INT NOT NULL,
	Archivado BIT DEFAULT 0,
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
);

CREATE TABLE Facturas (
    FacturaID INT IDENTITY(1,1) PRIMARY KEY,  -- ID único para la factura
    ClienteID INT NOT NULL,                   -- Relación con el cliente
    UUID NVARCHAR(50) UNIQUE NOT NULL,        -- Folio fiscal del CFDI (UUID)
    Serie NVARCHAR(20),                        -- Serie de la factura
    Folio NVARCHAR(20),                        -- Folio de la factura
    FechaEmision DATETIME NOT NULL,            -- Fecha y hora de emisión
    FormaPago NVARCHAR(50),                    -- Forma de pago (ejemplo: "Transferencia")
    MetodoPago NVARCHAR(50),                   -- Método de pago (ejemplo: "PUE")
    Moneda NVARCHAR(10),                        -- Moneda usada en la factura
    TipoCambio DECIMAL(10,4),                   -- Tipo de cambio (si aplica)
    Subtotal DECIMAL(18,2) NOT NULL,           -- Subtotal antes de impuestos
    IVA DECIMAL(18,2),                         -- IVA trasladado
    Retenciones DECIMAL(18,2),                 -- Retenciones aplicadas
    Total DECIMAL(18,2) NOT NULL,              -- Total de la factura
    RFCEmisor NVARCHAR(20) NOT NULL,           -- RFC del emisor
    NombreEmisor NVARCHAR(255),                -- Nombre del emisor
    RFCReceptor NVARCHAR(20) NOT NULL,         -- RFC del receptor
    NombreReceptor NVARCHAR(255),              -- Nombre del receptor
    Estatus NVARCHAR(50) DEFAULT 'Activa',     -- Estado de la factura (Activa, Cancelada, etc.)
	NumeroFactura VARCHAR(50),
	Tipo VARCHAR(1) NOT NULL,
	Fecha DATE,
    EnlacePDF NVARCHAR(255),                   -- Enlace al PDF de la factura
    EnlaceXML NVARCHAR(255),                   -- Enlace al XML de la factura
    FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID)
);

CREATE TABLE Alertas (
    AlertaID INT PRIMARY KEY IDENTITY(1,1),
    Tipo NVARCHAR(50) NOT NULL, 
    FechaVencimiento DATETIME NOT NULL,
    Estado NVARCHAR(20) NOT NULL DEFAULT 'Pendiente', 
    NombreClientes NVARCHAR(255),
    UsuarioID INT, 
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID) 
);

/* Crear admin con contraseña = admin cifrada*/
INSERT INTO Usuarios (Nombre, Correo, Contrasena, Rol, FechaExpiracion)
VALUES ('Admin', 'admin@ejemplo.com', '$2b$10$paHU6DPES.MRZy4iROC/8u.5nekducarh39aEmqjGW682.t04kRRe', 'admin', NULL);

SELECT * FROM Clientes;
SELECT * FROM Usuarios;
SELECT * FROM Facturas;
SELECT * FROM Alertas;
