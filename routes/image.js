var express = require('express');
var router = express.Router();

const upload = require('../config/multer');

/*
    파일 전송 시 content-type은 form-data로 지정합니다.
    form-data로 오는 모든 데이터는 string으로 들어오니 적절하게 형변환해서 사용하세요.
    파일 전송할 때 upload 모듈로 받지 않으면 body 값을 인식 못합니다! 빼먹지 말고 꼭 쓰셔야해요!!
*/

//파일 하나 보낼 때 (upload.single-->upload는 config의 multer를 의미하는 것)
router.post('/single', upload.single('img'), (req, res) => {//postman에서 form-data key값 이름 'img'
    /*
        파일이 하나만 전송할 때 single 메소드 쓰임
        file.location으로 전송된 파일 경로 접근
    */
    const img = req.file.location;//single일 경우 req.file.location으로 경로 접근한다. 
    console.log(img);
});

router.post('/multi', upload.array('imgs'), (req, res) => {
    /*
        파일을 여러개 전송할 때 array 메소드 쓰임
        req.files에 전송된 파일들에 대한 정보가 들어있음
        files[i].location으로 전송된 파일 경로 접근
    */
    const imgs = req.files;
    for (let i = 0; i < imgs.length; i++) {
        console.log(imgs[i].location)//여러개의 파일일 경우 imgs[i].loaction으로 경로 접근(그래서 콘솔창에 img의 url이 img수 만큼 뜬다)
    }
});

router.post('/fields', upload.fields([{ name: 'img' }, { name: 'photos' }]), (req, res) => {//img, photo둘다 받을 때
    /*
        파일을 여러개 전송할 때 fields 메소드 쓰임
        req.files에 전송된 키 값 이름으로 사진에 대한 정보 배열이 들어가있음
        files.키값[i].location으로 전송된 파일 경로 접근
    */
    console.log(req.files);
    console.log("------------------------------");
    console.log(req.files.img[0].location);
    console.log(req.files.photos[0].location);//photos는 하나만 보내도 배열의 형태이다!!!
})

module.exports = router;