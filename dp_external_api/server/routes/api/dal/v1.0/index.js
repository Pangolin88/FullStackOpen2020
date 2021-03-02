import {Router} from 'express';
import Utils from "../../../../extras/Utils";

const router = Router();

router.get('/info', (req, res) => {
    Utils.jsonResponse(res, {version: "1.0"})
})

router.use((req, res) => {
    return Utils.jsonResponse(res, {message: 'Unsupported this version', status: 'failed'})
})

// router.use('/facebook', FacebookRouter);
// router.use('/tableau', TableauRouter);

export default router;