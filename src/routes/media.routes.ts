import { Router} from 'express'
import MediaController from '../controllers/media.controller'


const router = Router()
const mediaController = new MediaController()


router.post('/', mediaController.createMedia)
router.get('/transcode', mediaController.transcodeMedia)
router.get('/:id',mediaController.getMedia )
router.get('/',mediaController.listMedia )


export default router