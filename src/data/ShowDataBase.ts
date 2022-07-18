import { SetShow } from '../model/SetShow'
import { DAY } from '../types/MarcarShow'
import { ShowDataBaseOutput } from '../types/ShowDataBaseOutput'
import { BaseDataBase } from './BaseDataBase'

const tableName = "lama_show"

export class ShowDataBase extends BaseDataBase {

    public getShows = async (day: string): Promise<ShowDataBaseOutput[]> => {
       const shows: ShowDataBaseOutput[] = await BaseDataBase.connection(tableName)
            .select("name as band", "music_genre as musicGenre")
            .join("lama_band", "lama_band.id", "lama_show.band_id")
            .where({week_day: day})
            .orderBy("start_time")

        return shows
    }

    getShowByDayAndTime = async (day: DAY) => {
        try {
            const result = await BaseDataBase.connection()
                .select("start_time", "end_time")
                .from(tableName)
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
            .into(tableName)
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
}