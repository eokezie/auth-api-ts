import express, {Response} from 'express';
const router = express.Router();

router.get(
    '/healthcheck',
    (_, res: Response) => {
        res.sendStatus(200)
    }
)

export default router;