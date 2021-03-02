import {Router} from 'express';
import Utils from "../../../../extras/Utils";
import TableauRouter from './tableau'

const router = Router()
router.get('/info', (req, res) => {
    Utils.jsonResponse(res, {version: "1.0"})
})

router.use('/tableau', TableauRouter)
export default router;