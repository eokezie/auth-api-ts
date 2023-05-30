import express, {Request, Response} from 'express';
import validateResouce from '../middleware/validationResource';
import { 
    createUserSchema, 
    verifyUserSchema, 
    forgotPasswordSchema,
    resetPasswordSchema
} from '../schema/user.schema';
import { 
    createUserHandler, 
    veriffyUserHandler, 
    forgotPasswordHandler,
    resetPasswordHandler
} from '../controller/user.controller';


const router = express.Router();

router.post(
    '/api/users',
    validateResouce(createUserSchema),
    createUserHandler
)

router.post(
    "/api/users/verify/:id/:verificationCode",
    validateResouce(verifyUserSchema),
    veriffyUserHandler 
)

router.post(
    "/api/users/forgot-password",
    validateResouce(forgotPasswordSchema),
    forgotPasswordHandler 
)

router.post(
    "/api/users/reset-password/:id/:passwordResetCode",
    validateResouce(resetPasswordSchema),
    resetPasswordHandler 
)

export default router;