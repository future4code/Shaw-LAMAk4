import BandModel from '../model/BandModel'
import { BaseDataBase } from './BaseDataBase'
import { bandDataBaseOutput } from '../types/bandDataBaseOutput'

const tableName = "lama_band"

export class BandDataBase extends BaseDataBase {

    public registerBand = async (band: BandModel): Promise<void> => {
        await BaseDataBase.connection
            .insert({
                id: band.getId(),
                name: band.getName(),
                music_genre: band.getMusicGenre(),
                responsible: band.getResponsible()
            })
            .into(tableName);
    }

    public getBandByIdOrName = async (id: string, name: string): Promise<bandDataBaseOutput[]> => {
        const band: bandDataBaseOutput[] = await BaseDataBase.connection()
            .select("id", "name", "music_genre as musicGenre", "responsible")
            .where("id OR name", { id, name })
            .from(tableName)

        return band
    }

    public getBandById = async (id: string): Promise<bandDataBaseOutput[]> => {
        const band: bandDataBaseOutput[] = await BaseDataBase.connection()
            .select("id", "name", "music_genre as musicGenre", "responsible")
            .where({ id})
            .from(tableName)

        return band
    }

    public getBandByName = async (name: string): Promise<bandDataBaseOutput[]> => {
        const band: bandDataBaseOutput[] = await BaseDataBase.connection()
            .select("id", "name", "music_genre as musicGenre", "responsible")
            .where({ name })
            .from(tableName)

        return band
    }

    public getBandByResponsible = async (responsible: string): Promise<bandDataBaseOutput[]> => {
        const band: bandDataBaseOutput[] = await BaseDataBase.connection()
            .select("id", "name", "music_genre as musicGenre", "responsible")
            .where({ responsible })
            .from(tableName)

        return band
    }
}