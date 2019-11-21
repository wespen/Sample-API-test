# Truebase Code Test challange microservice #

Description of API routes is available in `/swagger` endpoint in development environment

Env vars are set in separate file.  
Use `.env-dev` for local development, default port is `3000`  
Use **dockerfile.dev** for local deployment testing  
Use provided VS Code launch configuration for debugging
  
## Deployment ##
`.env-default` contains for a list of vars required for deployment.  
Use provided **dockerfile** for production deployment

Service is started via `npm run start`