# Proyecto App Sol de América – Trabajo Integrador Final – Grupo 4

## Enlace al repositorio
<https://github.com/julianotazo/app_sol_de_america.git>

## Grupo
Grupo 4

## Integrantes
- Gavilán, Agostina Anabel  
- Otazo, Julián Ezequiel  

## Descripción

Aplicación full-stack del Club Sol de América desarrollada como parte del Trabajo Integrador Final.  
Incluye backend con Node.js + Express + PostgreSQL, frontend con React + Vite, autenticación (login y registro), contenedores Docker y workflows de integración continua.


## Instructivo para ejecutar el proyecto con Docker🐳

### 1. Clonar el repositorio
```bash
git clone https://github.com/julianotazo/app_sol_de_america.git
```

### 2. Primera ejecución del proyecto
```bash
docker compose up --build
```
Este comando crea las imágenes necesarias e inicia todos los servicios.

### 3. Ejecuciones posteriores del proyecto
```bash
docker compose up
```
Este comando ejecuta el proyecto sin crear las imágenes y servicios, porque ya están creadas.

### 4. Apagar los contenedores
```bash
docker compose down
```
Esto detiene todos los servicios sin borrar los datos.
