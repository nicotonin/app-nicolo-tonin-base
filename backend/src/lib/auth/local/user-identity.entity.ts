import { User } from "../../../api/user/user.entity"

export type UserIdentity = {
    id: string,
    provider: string,
    credentials: {
        email: string,
        hashedPassword: string
    },
    user: User
}