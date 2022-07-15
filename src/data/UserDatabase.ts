import { User } from "../model/User";
import { BaseDataBase } from "./BaseDataBase";

export class UserDatabase extends BaseDataBase {
    private static TABLE_NAME = "lama_user"

    insertUser = async (newUser: User): Promise<void> => {
        try {
            await BaseDataBase.connection()
                .insert({
                    id: newUser.getId(),
                    name: newUser.getName(),
                    email: newUser.getEmail(),
                    password: newUser.getPassword(),
                    role: newUser.getRole()
                })
                .into(UserDatabase.TABLE_NAME)
        } catch (error: any) {
            console.log(error)
            throw new Error(error.sqlMessage || error.message)
        }
    }

    getUserByEmail = async (email: string) => {
        try {
            const result = await BaseDataBase.connection()
                .select("*")
                .from(UserDatabase.TABLE_NAME)
                .where({ email })
            
            return result[0] && User.toUserModel(result[0])
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    getUserById = async (id: string) => {
        try {
            const result = await BaseDataBase.connection()
                .select("*")
                .from(UserDatabase.TABLE_NAME)
                .where({ id })

            return result[0] && User.toUserModel(result[0])
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
}