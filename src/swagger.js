import swaggerJsdoc from "swagger-jsdoc"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Recetas",
      version: "1.0.0",
      description: "API para gestionar recetas de cocina",
    },
    servers: [
      {
        url: "https://api-recetas-fbarri.onrender.com",
        description: "Producción",
      },
      {
        url: "http://localhost:3000",
        description: "Desarrollo",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
}

export const swaggerSpec = swaggerJsdoc(options)
