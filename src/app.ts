import express, {Response, Request} from 'express'
import mediaRoutes from "./routes/media.routes"

require('dotenv').config();


const app = express()

const API_VERSION = process.env.API_VERSION || 'v1'


app.use(`/api/${API_VERSION}/files`, mediaRoutes)

app.get('/', (req:Request, res:Response) => res.json({message: `MPEG-DASH server version 1. Visit 'http://localhost:4000/api-docs' to view open api docs and endpoints`}));

export default app;