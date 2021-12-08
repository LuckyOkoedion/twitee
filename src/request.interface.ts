import { Request } from 'express'

export interface RequestWithUser extends Request {
    user: {
        userId: any,
        [x: string]: any
    },
    [x: string]: any
}