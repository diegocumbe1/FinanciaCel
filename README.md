# 📱 FinanciaCel

Proyecto de backend desarrollado en PHP con Laravel, base de datos PostgreSQL y frontend en Vite.js. Dockerizado para facilitar la ejecución en cualquier entorno.

---

## 🚀 Tecnologías utilizadas

- ✅ PHP 8.3 + Laravel
- ✅ PostgreSQL
- ✅ Vite.js
- ✅ Docker + Docker Compose
- ✅ Swagger (documentación API)

---

## 🛠️ Requisitos previos

Asegúrate de tener instalado:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

---

## ⚙️ Instalación y ejecución del proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/diegocumbe1/FinanciaCel.git
cd FinanciaCel
```

### 2. Levantar los servicios con Docker

```bash
docker compose up --build
```
### 📄 Documentación API (Swagger)
Una vez los servicios estén corriendo, puedes acceder a la documentación interactiva de la API en:

[localhost:8000/api/documentation](http://localhost:8000/api/documentation)

### Ejecutar migraciones y seeders

Este comando elimina las tablas existentes, recrea la base de datos y carga los datos de ejemplo:

```bash
docker exec -it financiacel_app php artisan migrate:fresh --seed
```
### Visualización de Frontend

[localhost:5173/](http://localhost:5173/)
