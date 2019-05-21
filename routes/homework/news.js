var express = require('express');
var router = express.Router();
const crypto = require('crypto-promise');
const util = require('../../module/utils');
const statusCode = require('../../module/statusCode');
const resMessage = require('../../module/responseMessage');
const db = require('../../module/pool');
const upload = require('../../config/multer');
const moment = require('moment');

//게시물 저장(news table)
//body-name, title, thumbnail(한 개), writetime
router.post('/', upload.single('thumbnail'), async(req, res) => {
    const insertNewsQuery = 'INSERT INTO news (name, title, thumbnail, writetime) VALUES (?, ?, ?, ?)';
    const thumbnail = req.file.location;
    const writetime = moment().format("YYYY-MM-DD HH:mm:ss");
    const insertNewsResult = await db.queryParam_Parse(insertNewsQuery, [req.body.name, req.body.title, thumbnail, writetime]);
    if (insertNewsResult.length == 0) {
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.NEWS_INSERT_FAIL));
    } else {
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.NEWS_INSERT_SUCCESS));
    }
});

//게시물 저장(newsInfo table)
//body- content, infoImg(여러 개)
router.post('/info', upload.array('infoImgs'), async(req, res) => {
    const infoImgs = req.files;
    for (let i = 0; i < infoImgs.length; i++) {
        const insertNewsInfoQuery = 'INSERT INTO newsInfo (content, infoImgs, newsIdx) VALUES (?, ?, ?)';
        var insertNewsInfoResult = await db.queryParam_Parse(insertNewsInfoQuery, [req.body.content, infoImgs[i].location, req.body.newsIdx]);
    }
    if (insertNewsInfoResult.length == 0) {
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.NEWSINFO_INSERT_FAIL));
    } else { //게시물 저장 성공(3개의 쿼리문 모두 성공 했을 때)
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.NEWSINFO_INSERT_SUCCESS));
    }
});

//저장된 게시물 불러오기
//게시물은 최신순으로 불러오기
//newsIdx, name, title, thumbnail, writetime(news)
router.get('/', async(req, res)=>{
    const getAllNewsQuery = 'SELECT * FROM news ORDER BY writetime DESC';//최신순으로 select한다.
    const getAllNewsResult = await db.queryParam_None(getAllNewsQuery);
    if (getAllNewsResult.length == 0) { 
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.NEWS_SELECT_FAIL));
    } else {
        res.status(200).send(util.successTrue(statusCode.OK, resMessage.NEWS_SELECT_SUCCESS, getAllNewsResult));
    }
});

//해당 Idx를 가진 게시물 불러오기
//title, content, infoImg, writetime
router.get('/:idx', async(req, res)=>{
    const getNewsQuery = 'SELECT title,writetime FROM news WHERE newsIdx=?';
    const getNewsResult = await db.queryParam_Parse(getNewsQuery,[req.params.idx]);
    if (getNewsResult.length == 0) { //일치하는 newsIdx 없음
        res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.NEWSIDX_SELECT_FAIL));
    } else { //쿼리문이 성공했을 때
        const getNewsInfoQuery = 'SELECT content,infoImgs FROM newsInfo WHERE newsIdx=?';
        const getNewsInfoResult = await db.queryParam_Parse(getNewsInfoQuery,[req.params.idx]);
        if (getNewsInfoResult.length == 0) { //일치하는 newsIdx 없음
            res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.NEWSIDX_SELECT_FAIL));
        } else { //게시물 불러오기 성공
            final_result=[];
            final_result.push(getNewsResult);
            final_result.push(getNewsInfoResult);
            res.status(200).send(util.successTrue(statusCode.OK, resMessage.NEWS_SELECT_SUCCESS,final_result));
        }
    }
});


module.exports = router;