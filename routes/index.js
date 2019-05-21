var express = require('express');
var router = express.Router();

router.use('/image', require('./image'));
//아무리 스케줄러만 있는 파일이라도 꼭 라우팅 등록 해야합니다! 아니면 실행이 안돼요!!!
router.use('/scheduler', require('./scheduler'));
router.use('/training', require('./training'));
router.use('/homework', require('./homework'));

module.exports = router;