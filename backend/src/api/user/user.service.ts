import { UserIdentityModel } from "../../lib/auth/local/user-identity.model";
import { User } from "./user.entity";
import { UserModel } from "./user.model";
import bcrypt from 'bcrypt';

export class UserExistsError extends Error {
    constructor() {
        super();
        this.name = 'UserExists';
        this.message = 'username already in use';
    }
}

export class UserService {

    async add(user: User, credentials: { email: string, password: string }): Promise<User> {
        const existingIdentity = await UserIdentityModel.findOne({ 'credentials.email': credentials.email });
        if (existingIdentity) {
            throw new UserExistsError();
        }
        const newUser = await UserModel.create(user);

        const hashedPassword = await bcrypt.hash(credentials.password, 6);

        await UserIdentityModel.create({
            provider: 'local',
            user: newUser.id,
            credentials: {
                email: credentials.email,
                hashedPassword
            }
        });

        return newUser;
    }

    async getUsers(role: string): Promise<User[]> {
        let query = {};
        if (role) {
            query = {role: role};
        }

        return await UserModel.find(query);
    }
}

export default new UserService();
