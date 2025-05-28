import { NOT_FOUND, OK } from "../constants/statusCodes";
import sessionModel from "../model/session.model";
import appAssert from "../utils/AppAssert";
import catchErrors from "../utils/catchError";
import { z } from "zod/v4";
export const getSessionsHandler = catchErrors(async (req, res) => {
    const sessions = await sessionModel.find(
        {
            userId: req.userId,
            expiresAt: { $gt: new Date() }
        },
        {
            _id: 1,
            userAgent: 1,
            createdAt: 1,
        },
        {
            sort: { createdAt: -1 },
        }
    )

    // since we have alraedy authenticated the user, we can safely assume that req.userId is available and we don't need to appAssert it in the response

    return res.status(OK).json(sessions.map((session) => ({
        ...session.toObject(),
        ...(session._id === req.sessionId &&
        {
            isCurrent: true
        })

    })
    ))
})


export const deleteSessionHandler = catchErrors(async (req, res) => {
    const sessionId = z.string().parse(req.params.id);
    const deletedSession = await sessionModel.findOneAndDelete({
        _id: sessionId,
    })
    appAssert(
        deletedSession,
        NOT_FOUND,
        "Session not found",
    )

    return res.status(OK).json({
        message: "Session deleted successfully",
    });
})
