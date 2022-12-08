import { Request, Response, NextFunction } from 'express'
import { CatchExpressError } from '../utils/errorHandlers';
import { ResponseHandlers } from '../utils/responseHandler';
import { prepareMediaFiles, uploadToS3 } from '../scripts/cmd';
import { MediaModel } from '../models/media.model';

const fs = require('fs')
const path = require('path');





class MediaController {

    outputPath = path.join(process.cwd(), `/onvumediauploads`)
    fileName = path.join(process.cwd(), `video.mp4`)

    command = `ffmpeg -re -i ${this.fileName} -vf pad="width=ceil(iw/2)*2:height=ceil(ih/2)*2" -map 0 -map 0 -c:a aac -c:v libx264 -b:v:0 800k -b:v:1 300k -s:v:1 320x170 -profile:v:1 baseline -profile:v:0 main -bf 1 -keyint_min 120 -g 120 -sc_threshold 0 -b_strategy 0 -ar:a:1 22050 -use_timeline 1 -use_template 1 -window_size 5 -f dash ${this.outputPath}/manifest.mpd`

    constructor() {
        if (!fs.existsSync(this.outputPath)) {
            fs.mkdirSync(this.outputPath) // create output dir if it does not exist
        }
    }


    transcodeMedia = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {


        res.status(200).send({
            message: 'You file is being transcoded to MPEG-DASH format'
        })
        res.on('finish', async () => {
            await prepareMediaFiles(this.command, console.log)// run the transcoding task in the background
        })


    })


    createMedia = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {

        res.status(200).send({
            message: 'You files are being uploaded'
        })
        res.on('finish', async () => {
            await uploadToS3(this.outputPath) // run the s3 upload task in the background
        })


    })

    listMedia = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {

        const documents = new ResponseHandlers(MediaModel.find(), req.query).filter().sort().limitFields().paginate()
        const data = await documents.model

        res.status(200).send(data)

    })

    getMedia = CatchExpressError(async (req: Request, res: Response, next: NextFunction) => {

        const document = await MediaModel.findById(req.params.id)

        if (!document) {
            return (res.status(404).send({
                status: 'fail',
                message: 'No document found!'

            }))

        }

        res.status(200).send(document)


    })

}

export default MediaController