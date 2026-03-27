# 🚀 GUÍA DE DESPLIEGUE — Performance Management System
## Spring Boot + Angular 17 en Apache Tomcat · Windows Server 2025

---

## 📋 Tabla de Contenidos

1. [Arquitectura](#1-arquitectura)
2. [Pre-requisitos](#2-pre-requisitos)
3. [Instalación de Software](#3-instalación-de-software)
4. [Configuración de Variables de Entorno (PATH)](#4-configuración-de-variables-de-entorno-path)
5. [Configuración de PostgreSQL](#5-configuración-de-postgresql)
6. [Build del Backend (WAR)](#6-build-del-backend-war)
7. [Build del Frontend (Angular)](#7-build-del-frontend-angular)
8. [Deploy en Apache Tomcat](#8-deploy-en-apache-tomcat)
9. [Configuración del Firewall](#9-configuración-del-firewall)
10. [Verificación Final](#10-verificación-final)
11. [Comandos Útiles](#11-comandos-útiles)
12. [Solución de Problemas](#12-solución-de-problemas)

---

## 1. Arquitectura

```
┌─────────────────────────────────────────────────────┐
│              WINDOWS SERVER 2025                     │
│              IP: 192.168.101.10                      │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │           APACHE TOMCAT 10.1                  │   │
│  │           Puerto: 8080                        │   │
│  │                                               │   │
│  │  ┌─────────────────┐  ┌──────────────────┐   │   │
│  │  │   webapps/ROOT   │  │  performance-    │   │   │
│  │  │                  │  │  management.war  │   │   │
│  │  │  Angular 17      │  │                  │   │   │
│  │  │  (HTML/CSS/JS)   │  │  Spring Boot     │   │   │
│  │  │                  │  │  API REST        │   │   │
│  │  └─────────────────┘  └───────┬──────────┘   │   │
│  └───────────────────────────────┼──────────────┘   │
│                                  │                   │
│  ┌───────────────────────────────▼──────────────┐   │
│  │          POSTGRESQL 16+                       │   │
│  │          Base de datos: performance_db        │   │
│  │          Puerto: 5432                         │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

| Componente | Tecnología | Versión |
|---|---|---|
| Backend | Spring Boot | 3.2.3 |
| Frontend | Angular | 17 |
| Base de datos | PostgreSQL | 16+ |
| Servidor web | Apache Tomcat | 10.1.x |
| JDK | Java (Eclipse Temurin) | 17 LTS |
| Build tool | Apache Maven | 3.9+ |
| Node.js | (solo para build) | 18+ LTS |

---

## 2. Pre-requisitos

- Windows Server 2025 instalado y configurado
- Acceso de administrador al servidor
- Conexión a internet (para descargas)
- El código fuente del proyecto (repositorio Git)

---

## 3. Instalación de Software

### 3.1 Java 17 LTS (Eclipse Temurin)

1. Descargar desde: https://adoptium.net/temurin/releases/?version=17&os=windows&arch=x64
2. Descargar el **MSI Installer** (.msi)
3. Ejecutar el instalador
4. **IMPORTANTE:** Durante la instalación, marcar la opción "Set JAVA_HOME variable"
5. Completar la instalación

**Verificar:**
```powershell
java -version
# Debe mostrar: openjdk version "17.0.x"
```

### 3.2 Apache Maven 3.9+

1. Descargar desde: https://maven.apache.org/download.cgi
2. Descargar el **Binary zip archive** (`apache-maven-3.9.x-bin.zip`)
3. Extraer el contenido en `C:\maven`
4. Verificar que exista: `C:\maven\bin\mvn.cmd`

**Verificar (después de configurar PATH):**
```powershell
mvn -version
# Debe mostrar: Apache Maven 3.9.x
```

### 3.3 Node.js 18+ LTS

> ⚠️ Node.js NO se usa en producción. Solo es necesario para compilar Angular.

1. Descargar desde: https://nodejs.org/
2. Descargar la versión **LTS** (.msi)
3. Ejecutar el instalador con opciones por defecto
4. El instalador agrega Node.js al PATH automáticamente

**Verificar:**
```powershell
node -v
npm -v
```

### 3.4 PostgreSQL 16+

1. Descargar desde: https://www.postgresql.org/download/windows/
2. Ejecutar el instalador
3. Configurar la contraseña del usuario `postgres` (recordarla para después)
4. Puerto por defecto: `5432`
5. Completar la instalación

### 3.5 Apache Tomcat 10.1

> ⚠️ **MUY IMPORTANTE:** Descargar la versión **Core**, NO la versión Embedded.

1. Ir a: https://tomcat.apache.org/download-10.cgi
2. En la sección **"Binary Distributions" → "Core"**
3. Descargar **"64-bit Windows zip"**
   - ✅ Correcto: `apache-tomcat-10.1.x-windows-x64.zip`
   - ❌ Incorrecto: `apache-tomcat-10.1.x-embed.zip`
4. Extraer el contenido en `C:\tomcat`

**Verificar que la estructura sea:**
```
C:\tomcat\
├── bin\
│   ├── startup.bat       ← iniciar servidor
│   └── shutdown.bat      ← detener servidor
├── conf\
│   └── server.xml
├── lib\
├── logs\
├── temp\
├── webapps\              ← DEBE EXISTIR
│   ├── ROOT\             ← DEBE EXISTIR
│   ├── docs\
│   ├── examples\
│   ├── host-manager\
│   └── manager\
└── work\
```

> Si no ves la carpeta `webapps`, descargaste la versión equivocada.

---

## 4. Configuración de Variables de Entorno (PATH)

### Opción A: Por Interfaz Gráfica

1. Presionar `Win + R` → escribir `sysdm.cpl` → Enter
2. Ir a la pestaña **"Opciones avanzadas"** (Advanced)
3. Clic en **"Variables de entorno..."** (Environment Variables)

**Crear variables nuevas (en "Variables del sistema"):**

| Variable | Valor |
|---|---|
| `JAVA_HOME` | `C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot` |
| `CATALINA_HOME` | `C:\tomcat` |

> ⚠️ La ruta de JAVA_HOME puede variar. Verificar el nombre exacto de la carpeta en `C:\Program Files\Eclipse Adoptium\`

**Editar la variable `Path` y agregar:**

```
%JAVA_HOME%\bin
C:\maven\bin
%CATALINA_HOME%\bin
```

4. Clic en **Aceptar** en todas las ventanas
5. **Cerrar y reabrir** PowerShell

### Opción B: Por PowerShell (como Administrador)

> ⚠️ Abrir PowerShell con **"Ejecutar como administrador"** (clic derecho → Ejecutar como administrador)

```powershell
# JAVA_HOME (ajustar la ruta según la versión instalada)
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot", "Machine")

# CATALINA_HOME
[System.Environment]::SetEnvironmentVariable("CATALINA_HOME", "C:\tomcat", "Machine")

# Agregar al PATH
$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
$currentPath += ";%JAVA_HOME%\bin;C:\maven\bin;%CATALINA_HOME%\bin"
[System.Environment]::SetEnvironmentVariable("Path", $currentPath, "Machine")
```

> ⚠️ Después de ejecutar, **cerrar y abrir un nuevo PowerShell** para que tome los cambios.

### Verificar todo:

```powershell
java -version
echo $env:JAVA_HOME
mvn -version
node -v
echo $env:CATALINA_HOME
```

**Resultado esperado:**
```
openjdk version "17.0.18" 2026-01-20
C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot
Apache Maven 3.9.14
v24.14.1
C:\tomcat
```

---

## 5. Configuración de PostgreSQL

### 5.1 Crear la base de datos

Abrir **pgAdmin** o **psql** y ejecutar:

```sql
CREATE DATABASE performance_db;
```

### 5.2 Verificar credenciales

Las credenciales deben coincidir con el archivo `application.properties` del backend:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/performance_db
spring.datasource.username=postgres
spring.datasource.password=1234
```

> ⚠️ Si la contraseña de PostgreSQL es diferente a `1234`, editar el archivo `application.properties` antes de compilar.

---

## 6. Build del Backend (WAR)

### 6.1 Cambios necesarios en el código (ya realizados)

Los siguientes cambios ya fueron aplicados al código fuente:

**`backend/pom.xml`:**
- Agregado `<packaging>war</packaging>`
- Agregada dependencia `spring-boot-starter-tomcat` con scope `provided`

**`backend/src/main/java/com/app/PerformanceManagementApplication.java`:**
- La clase extiende `SpringBootServletInitializer`
- Se sobreescribe el método `configure()`

**`backend/src/main/java/com/app/security/SecurityConfig.java`:**
- CORS actualizado para permitir `192.168.101.10:8080`

### 6.2 Compilar

```powershell
cd C:\FUMC\FUMC-Final\FUMC2-guille\backend
mvn clean package -DskipTests
```

### 6.3 Verificar

```powershell
dir target\*.war
```

**Debe aparecer:**
```
performance-management-0.0.1-SNAPSHOT.war    (~51 MB)
```

> ❌ Si aparece `.jar` en vez de `.war`, verificar que el `pom.xml` tiene `<packaging>war</packaging>`

---

## 7. Build del Frontend (Angular)

### 7.1 Cambios necesarios en el código (ya realizados)

**`frontend/src/environments/environment.ts`** (desarrollo):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

**`frontend/src/environments/environment.prod.ts`** (producción):
```typescript
export const environment = {
  production: true,
  apiUrl: 'http://192.168.101.10:8080/performance-management'
};
```

**`frontend/angular.json`:**
- Agregado `fileReplacements` en la configuración de producción

**Servicios actualizados:**
- `auth.service.ts` → usa `environment.apiUrl`
- `form.service.ts` → usa `environment.apiUrl`
- `process.service.ts` → usa `environment.apiUrl`

### 7.2 Instalar dependencias

```powershell
cd C:\FUMC\FUMC-Final\FUMC2-guille\frontend
npm install --legacy-peer-deps
```

> Se usa `--legacy-peer-deps` para resolver conflictos de versiones con `ng2-charts`.

### 7.3 Compilar

```powershell
npx ng build --configuration production
```

### 7.4 Verificar

```powershell
dir dist\frontend\browser\
```

**Debe aparecer:** `index.html`, archivos `.js`, archivos `.css`, etc.

---

## 8. Deploy en Apache Tomcat

### 8.1 Detener Tomcat (si está corriendo)

```powershell
C:\tomcat\bin\shutdown.bat
```

Si no se detiene, forzar:
```powershell
Stop-Process -Name "java" -Force -ErrorAction SilentlyContinue
```

### 8.2 Desplegar Frontend (Angular → ROOT)

```powershell
# Limpiar ROOT
Remove-Item -Recurse -Force C:\tomcat\webapps\ROOT\*

# Copiar archivos de Angular
Copy-Item -Recurse C:\FUMC\FUMC-Final\FUMC2-guille\frontend\dist\frontend\browser\* C:\tomcat\webapps\ROOT\
```

### 8.3 Crear web.xml para Angular Routing

Angular usa rutas del lado del cliente (ej: `/dashboard`, `/login`). Sin este archivo, Tomcat devuelve error 404 al acceder directamente a esas rutas.

```powershell
New-Item -ItemType Directory -Path C:\tomcat\webapps\ROOT\WEB-INF -Force

@"
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee" version="6.0">
    <error-page>
        <error-code>404</error-code>
        <location>/index.html</location>
    </error-page>
</web-app>
"@ | Out-File C:\tomcat\webapps\ROOT\WEB-INF\web.xml -Encoding UTF8
```

### 8.4 Desplegar Backend (WAR)

```powershell
# Eliminar deploy anterior si existe
Remove-Item -Force C:\tomcat\webapps\performance-management.war -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force C:\tomcat\webapps\performance-management -ErrorAction SilentlyContinue

# Copiar nuevo WAR
Copy-Item C:\FUMC\FUMC-Final\FUMC2-guille\backend\target\performance-management-0.0.1-SNAPSHOT.war C:\tomcat\webapps\performance-management.war
```

### 8.5 Iniciar Tomcat

```powershell
C:\tomcat\bin\startup.bat
```

Esperar ~30 segundos a que la aplicación arranque completamente.

---

## 9. Configuración del Firewall

Abrir PowerShell **como Administrador**:

```powershell
New-NetFirewallRule -DisplayName "Tomcat HTTP" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow
```

---

## 10. Verificación Final

### 10.1 URLs de la aplicación

| Recurso | URL |
|---|---|
| **Frontend (Login)** | http://192.168.101.10:8080/ |
| **API - Login** | http://192.168.101.10:8080/performance-management/api/auth/login |
| **API - Forms** | http://192.168.101.10:8080/performance-management/api/forms |
| **API - Processes** | http://192.168.101.10:8080/performance-management/api/processes |
| **API - Users** | http://192.168.101.10:8080/performance-management/api/users |

### 10.2 Credenciales por defecto

| Campo | Valor |
|---|---|
| **Usuario** | `admin` |
| **Contraseña** | `admin123` |
| **Rol** | ADMIN |
| **Email** | admin@fumc.edu.co |

> El usuario admin se crea automáticamente al iniciar la aplicación por primera vez (solo si la tabla `users` está vacía).

### 10.3 Checklist

- [ ] `http://192.168.101.10:8080/` carga la pantalla de login
- [ ] Login con `admin` / `admin123` funciona
- [ ] Redirige al dashboard después del login
- [ ] Navegación directa a `/dashboard` no da error 404
- [ ] Se pueden crear formularios
- [ ] Se pueden gestionar usuarios (como admin)

### 10.4 Probar API desde PowerShell

```powershell
Invoke-WebRequest -Uri "http://localhost:8080/performance-management/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"admin","password":"admin123"}'
```

**Respuesta esperada:** `StatusCode: 200` con un JSON conteniendo `accessToken`.

---

## 11. Comandos Útiles

### Iniciar Tomcat
```powershell
C:\tomcat\bin\startup.bat
```

### Detener Tomcat
```powershell
C:\tomcat\bin\shutdown.bat
```

### Forzar detención de Tomcat
```powershell
Stop-Process -Name "java" -Force
```

### Ver logs de Tomcat
```powershell
# Últimas 50 líneas
Get-Content C:\tomcat\logs\catalina*.log -Tail 50

# Seguir logs en tiempo real
Get-Content C:\tomcat\logs\catalina*.log -Tail 20 -Wait
```

### Re-deploy completo (después de cambios en el código)
```powershell
# 1. Detener Tomcat
C:\tomcat\bin\shutdown.bat
Start-Sleep -Seconds 5

# 2. Rebuild backend
cd C:\FUMC\FUMC-Final\FUMC2-guille\backend
mvn clean package -DskipTests

# 3. Rebuild frontend
cd C:\FUMC\FUMC-Final\FUMC2-guille\frontend
npx ng build --configuration production

# 4. Deploy frontend
Remove-Item -Recurse -Force C:\tomcat\webapps\ROOT\*
Copy-Item -Recurse C:\FUMC\FUMC-Final\FUMC2-guille\frontend\dist\frontend\browser\* C:\tomcat\webapps\ROOT\
New-Item -ItemType Directory -Path C:\tomcat\webapps\ROOT\WEB-INF -Force
@"
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee" version="6.0">
    <error-page>
        <error-code>404</error-code>
        <location>/index.html</location>
    </error-page>
</web-app>
"@ | Out-File C:\tomcat\webapps\ROOT\WEB-INF\web.xml -Encoding UTF8

# 5. Deploy backend
Remove-Item -Force C:\tomcat\webapps\performance-management.war -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force C:\tomcat\webapps\performance-management -ErrorAction SilentlyContinue
Copy-Item C:\FUMC\FUMC-Final\FUMC2-guille\backend\target\performance-management-0.0.1-SNAPSHOT.war C:\tomcat\webapps\performance-management.war

# 6. Iniciar Tomcat
C:\tomcat\bin\startup.bat
```

---

## 12. Solución de Problemas

### ❌ Error: "Acceso denegado al Registro"
**Causa:** PowerShell no tiene permisos de administrador.
**Solución:** Cerrar PowerShell y abrir con **"Ejecutar como administrador"**.

### ❌ Tomcat no tiene carpeta `webapps`
**Causa:** Se descargó la versión **Embedded** en vez de **Core**.
**Solución:** Descargar "Core → 64-bit Windows zip" desde https://tomcat.apache.org/download-10.cgi

### ❌ Maven genera `.jar` en vez de `.war`
**Causa:** Falta `<packaging>war</packaging>` en el `pom.xml`.
**Solución:** Verificar que el `pom.xml` tiene:
```xml
<version>0.0.1-SNAPSHOT</version>
<packaging>war</packaging>
```

### ❌ `npm install` da error ERESOLVE
**Causa:** Conflicto de versiones de dependencias.
**Solución:** Usar `npm install --legacy-peer-deps`

### ❌ Error 404 al navegar a rutas de Angular
**Causa:** Falta el `web.xml` en `ROOT/WEB-INF/`.
**Solución:** Crear el archivo como se indica en el paso 8.3.

### ❌ Login falla desde el navegador pero funciona desde PowerShell
**Causa:** El frontend no apunta a la URL correcta del backend.
**Solución:** Verificar que `environment.prod.ts` tiene la IP correcta y que se recompiló el frontend con `--configuration production`.

### ❌ CORS error en el navegador
**Causa:** `SecurityConfig.java` no incluye el origen del frontend.
**Solución:** Agregar la IP/dominio a la lista de `setAllowedOrigins()` en `SecurityConfig.java`.

### ❌ No se creó el usuario admin
**Causa:** La tabla `users` ya tenía registros previos (el admin solo se crea si la tabla está vacía).
**Solución:** Verificar en PostgreSQL:
```sql
SELECT * FROM users;
```
Si está vacía, reiniciar Tomcat. Si tiene datos, el admin ya debería existir.

### ❌ Shutdown de Tomcat dice "Servidor no apagado"
**Causa:** Tomcat no estaba corriendo o el shutdown port no está configurado.
**Solución:** Forzar cierre con `Stop-Process -Name "java" -Force`

---

## 📌 Notas Importantes

1. **Node.js** NO se ejecuta en producción. Solo se usa para compilar Angular a archivos estáticos (HTML/CSS/JS).
2. **Tomcat** ejecuta el backend como WAR y sirve el frontend como archivos estáticos.
3. El **usuario admin** (`admin` / `admin123`) se crea automáticamente la primera vez que arranca la aplicación.
4. Si se cambia la **IP del servidor**, se debe actualizar:
   - `frontend/src/environments/environment.prod.ts` → `apiUrl`
   - `backend/.../security/SecurityConfig.java` → `setAllowedOrigins()`
   - Recompilar ambos y redesplegar.
5. Los **warnings de vulnerabilidades de npm** no afectan la aplicación en producción (son de herramientas de desarrollo).

---

*Última actualización: 26 de marzo de 2026*
*Proyecto: Performance Management System — FUMC*
