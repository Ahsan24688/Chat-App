import jwt from "jsonwebtoken";

const authmiddlewear = (req,res,next) => {
    try{
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No Token Found",
                data: null,
                code: 401
            })
        }

        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (error){
                return res.status(401).json({
                    message: "Access denied",
                    data: null,
                    code: 401
                })
            }

            req.user = decoded;
            next();
        })

    }
    catch(error){
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            code: 500
        })
    }
}

export {authmiddlewear};