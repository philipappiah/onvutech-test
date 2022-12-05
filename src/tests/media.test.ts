
import chai = require('chai');
import chaiHttp = require('chai-http');
import Database from '../config/db'
import {  uploadToS3 } from '../scripts/cmd';
import { MediaModel } from "../models/media.model"

const fs = require('fs')
const path = require('path');


require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost'
const PORT = process.env.PORT || 4000
const SERVER_URL = `${BASE_URL}:${PORT}/api/v1`

const MONGO_URL = process.env.MONGO_URL || `mongodb://127.0.0.1:27017/mydb`

const outputPath = path.join(process.cwd(), `/onvumediauploads`)

let should = chai.should();


chai.use(chaiHttp);

new Database(MONGO_URL).connectDataBase()


describe('Media MPD Files', () => {


    beforeEach((done) => {
        MediaModel.deleteMany({}, (err) => {
            done();
        });
    });

    // / test GET files route
    describe('/GET files', () => {
        it('it should GET all the MPD files', (done) => {
            chai.request(SERVER_URL)
                .get('/files')
                .end((err: any, res: any) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });



    // /test POST mediaFiles with validation error 
    describe('/POST mediaFile', () => {
        it('it should store generated dash media content to s3 storage', (done) => {

            uploadToS3(outputPath).then((res) => {
                chai.request(SERVER_URL)
                    .get('/files')
                    .end((err: any, res: any) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        console.log(res.body)
                        res.body.length.should.be.gt(0);
                        done();
                    });
            })


        });



    })


});


