import {Router} from 'express';

const healthCheckRouter = Router();
healthCheckRouter.get("/", (_, res) => {
    res.status(200).json({
        status: "healthy",
    });
}
);
export default healthCheckRouter;