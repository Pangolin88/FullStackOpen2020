import {Router} from 'express';
import FacebookRouter from './facebook';
import TableauRouter from './tableau';
import Utils from "../../../../extras/Utils";

const router = Router();

router.get('/info', (req, res) => {
    Utils.jsonResponse(res, {version: "1.1"})
})

router.use((req, res) => {
    return Utils.jsonResponse(res, {message: 'Unsupported this version. Please use v1.2 instead', status: 'failed'})
})

// router.use('/facebook', FacebookRouter);
// router.use('/tableau', TableauRouter);

export default router;