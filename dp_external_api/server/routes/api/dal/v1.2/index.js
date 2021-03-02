import {Router} from 'express';
import FacebookRouter from './facebook';
import TableauRouter from './tableau';
import Utils from "../../../../extras/Utils";

const router = Router();

router.get('/info', (req, res) => {
    Utils.jsonResponse(res, {version: "1.2"})
})

router.use('/facebook', FacebookRouter);
router.use('/tableau', TableauRouter);

export default router;