import express, {Request, Response} from 'express';
const router = express.Router();

router.post(
    '/api/users',
    (req: Request, res: Response) => {
        res.sendStatus(200)
    }
)

export default router;