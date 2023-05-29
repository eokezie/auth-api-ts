import { 
    prop, 
    getModelForClass, 
    modelOptions, 
    Severity,
    pre ,
    DocumentType
} from "@typegoose/typegoose";
import { nanoid } from "nanoid";
import argo2 from 'argon2';
import log from "../utils/logger";

@pre<User>("save", async function(){
    if(!this.isModified("password")){
        return
    }

    const hash = await argo2.hash(this.password)

    this.password = hash;

    return
}) 

@modelOptions({
    schemaOptions: {
        timestamps: true
    },
    options: {
        allowMixed: Severity.ALLOW
    }
})

export class User {
    @prop(
        {
            lowercase: true,
            required: true,
            unique: true
        }
    )
    email: string

    @prop(
        {
            required: true
        }
    )
    firstName: string

    @prop(
        {
            required: true
        }
    )
    lastName: string

    @prop(
        {
            required: true
        }
    )
    password: string

    @prop(
        {
            required: true,
            default: () => nanoid()
        }
    )
    verificationCode: string

    @prop()
    passwordResetCode: string | null

    @prop({ default: false })
    verified: boolean

    async validatePassword(this: DocumentType<User>, candidatePassword: string) {
        try {
            return await argo2.verify(this.password, candidatePassword)
        } catch (error) {
            log.error(error, "Could not validate password");
            return false
        }
    }
}

const UserModel = getModelForClass(User)

export default UserModel;