import { z } from "zod/v4";

export const validateSchema = (Schema) => {
    return (req,res,next) => {
        const result =Schema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                success:false,
                error:result.error.issues.map(issue=>({
                    path:issue.path,
                    message:issue.message
                }))
            })
        }

        req.validatedBody=result.data;
        next();
    }
}