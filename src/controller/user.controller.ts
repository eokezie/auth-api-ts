import { Request, Response } from "express";
import { nanoid } from "nanoid"
import { CreateUserInput, ForgotPasswordInput, VerifyUserInput, ResetPasswordInput } from "../schema/user.schema";
import { createUser, findUserById, findUserByEmail } from "../service/user.service";
import { sendEmail } from "../utils/mailer";
import log from "../utils/logger";

export async function createUserHandler(
    req: Request<{}, {}, CreateUserInput>, 
    res: Response) {

    const body = req.body;

    try {
        const user = await createUser(body);

        await sendEmail({
            from: 'test@gmail.com',
            to: user.email,
            subject: 'Please verify your account',
            text: `Verification code ${user.verificationCode}. ID: ${user._id}`
        });

        return res.send("User created successfully");
    } catch (error: any) {
        if(error.code === 11000) {
            return res.status(409)
                      .send("Account already exist");
        }

        return res.status(500)
                  .send(error)
    }
}

export async function veriffyUserHandler(
    req: Request<VerifyUserInput>, 
    res: Response
){
    const id = req.params.id;
    const verificationCode = req.params.verificationCode;

    /**Check if User ID is valid */
    if(id.match(/^[0-9a-fA-F]{24}$/)){
        /**Find the user by their */
        const user = await findUserById(id);

        if(!user) {
            return res.send("Could not verify user")
        }
    
        /**Check to see if they already are verified*/
        if(user.verified) {
            res.send("User is already verified")
        }
    
        /**Check to see if the verification matches */
        if(user.verificationCode === verificationCode) {
            user.verified = true;
            await user.save()
    
            return res.send("User successfully verified.");
        }
    
        return res.send("Could not verify userX");
    }else {
        return res.send("Invalid ID provided")
    }
};

export async function forgotPasswordHandler(
    req: Request<{}, {}, ForgotPasswordInput>, 
    res: Response
){
    const {email} = req.body;
    const user = await findUserByEmail(email);
    const message = 
        "If a user with this email is registered, you will receive an email."

    if(!user) {
        log.debug(`User with email: ${email} does not exist`);
        return res.send(message)
    }

    if(!user.verified) {
        return res.send("User is not verified")
    }

    const passwordResetCode = nanoid();
    user.passwordResetCode = passwordResetCode;

    await user.save();

    await sendEmail({
        to: user.email,
        from: 'test@gmail.com',
        subject: 'Reset your password',
        text: `Password reset code ${passwordResetCode}. ID: ${user._id}`
    });

    log.debug(`Password reset email sent to ${email}`)
    return res.send(message)
};

export async function resetPasswordHandler(
    req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>, 
    res: Response
){
    const { id, passwordResetCode } = req.params;
    const { password } = req.body;

    const user = await findUserById(id);

    if(!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
        return res.status(400).send("Could not reset your password")
    }

    user.passwordResetCode = null;
    user.password = password;

    await user.save();
    return res.send("Successfully upated your password")
}