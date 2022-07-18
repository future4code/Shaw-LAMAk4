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
}