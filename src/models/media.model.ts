import { Document, Schema, model } from 'mongoose';


export interface Media extends Document {
    id:string;
    title:string;
    url:string;
    description:string;

}


const MediaSchema = new Schema<Media>({

    title: {
      type: String,
      required: [true,"missing required field title"]
    },
    url: {
        type: String
    },
    description: {
        type: String
    }

   
  }, {timestamps:true})
  

  
  MediaSchema.virtual('id').get(function(){
    return this._id.toHexString();
  });
  
  
  MediaSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   
      delete ret._id 
     }
  });
  
  
  
  
  
  
  
  export const MediaModel = model<Media>("Media", MediaSchema);