import {exec} from 'child_process';
import {promisify} from 'util'
import { MediaModel } from '../models/media.model';

const AWS = require('aws-sdk')

const fs = require('fs')
const path = require('path')

require('dotenv').config();

const execAsync = promisify(exec);

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })

export async function prepareMediaFiles(command:string, callback:Function){

  
    try{
    const { stdout } = await execAsync(command)
    callback(stdout)

    }catch(err){
     callback(err)
    }

}



function getFilePaths(dirName:string){
  let filePaths :string[] = []

   fs.readdirSync(dirName).forEach((fname:string) => {
     const fpath = path.join(dirName, fname)
     const fstat = fs.statSync(fpath)
     if(fstat.isFile()){
      filePaths.push(fpath)
     }else{
      filePaths.push(...getFilePaths(fpath))
     }
   });

   return filePaths;

}


function uploadPromise(dirName:string,filePath:string){
  
  return new Promise((resolve, reject)=>{
    const fileContent = fs.readFileSync(filePath)
    const fileKey = filePath.split(`${dirName}`)[1].replace('\\', '')
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || 'onvumediauploads', 
      Key:fileKey, 
      Body: fileContent
  };
  
      s3.putObject(params, async (err:any, data:any) => {
          if (err) {
            reject(err)
          }
         
          
         
          
          console.log(`uploaded ${params.Key} to ${params.Bucket}`);
          resolve(fileKey)
        })
  })
  }
 


export async function uploadToS3(dirName:string){


  const uploadPromises = getFilePaths(dirName).map(filePath => uploadPromise(dirName,filePath)
  );
 
  return Promise.all(uploadPromises)
  .then(async (results)=>{

    const bucketName = process.env.AWS_S3_BUCKET_NAME || 'onvumediauploads'

    //let's persist the created mpd file to a database
    await MediaModel.create({
      title:`${bucketName}/mainfest.mpd`,
      description:'media description here'
    })

    console.log('All files uploaded successfully')
    
    return results
   
  })
  .catch((err) => {
    console.log(err)
    // we could roll back all the transaction if an error occurred during the uploads
    return err
   
  })


}


