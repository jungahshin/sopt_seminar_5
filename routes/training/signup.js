//회원가입
//body- id, name, profileImg, password
//profileImg 하나만 받음
//해당 정보 db에 저장
var express = require('express');
var router = express.Router();
const crypto = require('crypto-promise');
//const util = require('../../module/utils');
//const statusCode = require('../../module/statusCode');
//const resMessage = require('../../module/responseMessage');
//const db = require('../../module/pool');
const upload = require('../../config/multer');
const db = require('../../module/pool');

//파일 하나 보낼 때 (upload.single-->upload는 config의 multer를 의미하는 것)
router.post('/single', upload.single('profileImg'), async(req, res) => {//postman에서 form-data key값 이름 'img'
    /*
        파일이 하나만 전송할 때 single 메소드 쓰임
        file.location으로 전송된 파일 경로 접근
    */
    const insertUserQuery = 'INSERT INTO user_1 (id, name, profileImg, password) VALUES (?, ?, ?, ?)';
    const salt = await crypto.randomBytes(32);
    const salt_final = salt.toString('base64');
    const hashedPwd = await crypto.pbkdf2((req.body.password).toString(), salt_final, 1000, 32, 'SHA512');//.toString('hex')
    const hashedPwd_final = hashedPwd.toString('base64');
    const profileImg = req.file.location;
    const insertUserResult = await db.queryParam_Parse(insertUserQuery, [req.body.id, req.body.name, profileImg, hashedPwd_final]);//이것의 결과?????0(성공),1(실패)로 결과가 나옴?
    if (insertUserResult.length == 0) {//result가 비어있지 않으면
        console.log("회원 가입 실패");
        //res.status(200).send(util.successFalse(statusCode.DB_ERROR, resMessage.USER_INSERT_FAIL));//db 저장 실패(회원가입 실패)
    } else { //쿼리문이 성공했을 때
        console.log("회원 가입 성공!");
        //res.status(200).send(util.successTrue(statusCode.OK, resMessage.USER_INSERT_SUCCESS));//db 저장 성공(회원가입 성공)
    }
});

module.exports = router;