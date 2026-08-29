# PRD: Collawork — Plataforma para Encontrar Colaboradores de Trabajo

## 1. Resumen
Red social minimalista donde los usuarios crean un perfil profesional (con foto y banner) para encontrar personas con quienes colaborar en proyectos de trabajo. El proyecto sirve como vehículo de aprendizaje práctico para un stack completo de Cloud/DevOps.

## 2. Objetivo del proyecto
Doble objetivo:
1. Construir un MVP funcional de red de colaboración profesional.
2. Usar este proyecto como caso real para aplicar: AWS (S3, Cognito, RDS), contenerización (Docker), orquestación (Kubernetes + Helm), IaC (Terraform), CI/CD y GitOps (ArgoCD), y observabilidad (Prometheus, Grafana, Loki, Alertmanager).

## 3. Alcance funcional (MVP)

### 3.1 Autenticación
- Registro e inicio de sesión mediante Amazon Cognito
- Recuperación de contraseña (flujo nativo de Cognito)

### 3.2 Perfil de usuario
- Nombre, título/rol profesional, bio corta, habilidades (tags), ubicación
- Foto de perfil → almacenada en S3
- Banner de perfil → almacenado en S3
- Editar/eliminar información de perfil

### 3.3 Descubrimiento de personas
- Listado/feed de perfiles públicos
- Búsqueda por habilidad o rol
- Filtro básico (ubicación o disponibilidad)

### 3.4 Interacción básica
- Botón "Contactar" que expone el email/contacto del usuario (sin chat en tiempo real)
- Guardar/marcar perfil como favorito (stretch goal)

## 4. Modelo de datos (RDS)
- **users**: id, cognito_sub, name, email, title, bio, location, created_at
- **skills**: id, name
- **user_skills**: user_id, skill_id
- **profile_media**: user_id, avatar_url, banner_url
- **connections** (opcional): user_id_from, user_id_to, status

## 5. Arquitectura técnica

### 5.1 Servicios AWS
- **S3**: almacenamiento de fotos de perfil y banners
- **Cognito**: autenticación y gestión de usuarios
- **RDS** (Postgres): base de datos relacional
- **CloudFront** (fase posterior): CDN delante de S3 para servir imágenes
- **ECR** (fase posterior): registro de imágenes Docker
- **EKS** (fase posterior): cluster Kubernetes gestionado

### 5.2 Backend
- API REST en Python (FastAPI)
- Endpoints: auth callback, CRUD de perfil, generación de URLs prefirmadas de S3 para upload de imágenes, listado/búsqueda de usuarios

### 5.3 Frontend
- Next.js que consume la API e integra Cognito (Hosted UI o SDK)

## 6. Fases de implementación (mapeadas a la ruta de aprendizaje)

| Fase | Objetivo técnico | Tecnologías |
|---|---|---|
| 1 | App funcional en local | Python/FastAPI, Postgres local, Next.js |
| 2 | Integrar servicios AWS reales | S3, Cognito, RDS |
| 3 | Contenerización | Docker, docker-compose |
| 4 | Infraestructura como código | Terraform (VPC, RDS, S3, Cognito, ECR) |
| 5 | Orquestación | Kubernetes (EKS), Helm charts |
| 6 | CI/CD | GitHub Actions (build, test, push de imagen, deploy) |
| 7 | GitOps | ArgoCD (despliegue continuo desde repo Git) |
| 8 | Observabilidad | Prometheus, Grafana, Loki, Alertmanager |

## 7. Requisitos no funcionales
- Todo el código de infraestructura (Terraform, manifiestos K8s, pipelines) escrito manualmente, sin generación automática vía IA, para poder defenderlo en entrevistas técnicas
- IaC versionado en el mismo repositorio o en uno dedicado (a decidir en fase 4)
- Documentación de arquitectura actualizada al cierre de cada fase
- Cada fase del proyecto debe ser analizada personalmente antes de darla por cerrada
- Cada push al repositorio debe hacerse personalmente
- El diseño de la interfaz debe basarse enteramente en los mockups ubicados en la carpeta `mockups`
- El código debe seguir prácticas modulares y mantenerse limpio (clean code)

## 8. Fuera de alcance (MVP)
- Chat en tiempo real
- Sistema de pagos
- Notificaciones push
- Aplicación móvil nativa

## 9. Criterios de éxito
- Aplicación desplegada en AWS con EKS + Terraform + ArgoCD
- Pipeline CI/CD funcional de extremo a extremo
- Dashboard de observabilidad mostrando métricas y logs del sistema en producción
- Infraestructura 100% propia y explicable en detalle técnico
