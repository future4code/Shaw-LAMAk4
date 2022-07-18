import { SetShow } from "../model/SetShow";
import { User } from "../model/User";
import { DAY } from "../types/MarcarShow";
import { BaseDataBase } from "./BaseDataBase";

export class UserDatabase extends BaseDataBase {
    private static TABLE_NAME = "lama_user"
    private static LAMA_SHOW = "lama_show" 

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

    getShowByDayAndTime = async (day: DAY) => {
        try {
            const result = await BaseDataBase.connection()
                .select("start_time", "end_time")
                .from(UserDatabase.LAMA_SHOW)
                .where({week_day: day})
            
            return result
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    insertShow = async (show: SetShow) => {
        try {
            await BaseDataBase.connection()
            .insert({
                id: show.getId(),
                week_day: show.getDay(),
                start_time: show.getStartingTime(),
                end_time: show.getEndingTime(),
                band_id: show.getBandId()
            })
            .into(UserDatabase.LAMA_SHOW)
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
}