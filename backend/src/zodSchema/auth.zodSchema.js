import {z} from "zod/v4";
//TODO:add validation for profile pic also according to the input 

export const signUpSchema = z.object({
    username:
            z.string()
            .min(3,{message:"Username must be at least 3 character long"})
            .max(30,{message:"Username can't be more then 30 character long"})
            .trim()
    ,fullname:
        z.string()
        .min(3,{message:"Name must be at least 3 char long"})
        .max(30,{message:"Name can't be more then 30 character long"})
        .trim()
    ,email:
        z.email()
        .max(100,{message:"email can't be more then 100 character long"})
        .trim()
    ,password:
            z.string()
            .min(6,{message:"password must be atleast 6 character long"})
            .max(100,{message:"password can't be more then 100 characters long"})
            .regex(/^[a-zA-Z0-9@!#$%^&*()_+={}\[\]:;"'<>,.?\/\\|-]+$/, 
            {message: "Password can only contain letters, numbers, and special characters"})
            .trim()
})

export const signInSchema = z.object({
    username:
            z.string()
            .min(3,{message:"Username must be at least 3 character long"})
            .max(30,{message:"Username can't be more then 30 character long"})
            .trim()
    ,password:
            z.string()
            .min(6,{message:"password must be atleast 6 character long"})
            .max(100,{message:"password can't be more then 100 characters long"})
            .regex(/^[a-zA-Z0-9@!#$%^&*()_+={}\[\]:;"'<>,.?\/\\|-]+$/, 
            {message: "Password can only contain letters, numbers, and special characters"})
            .trim()
})