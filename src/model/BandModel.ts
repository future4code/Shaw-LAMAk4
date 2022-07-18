export default class BandModel {
   
    constructor(
        private id: string,
	    private name: string,
	    private musicGenre: string,
	    private responsible: string
    ){}

    public getId(){
        return this.id
    }
    public getName(){
        return this.name
    }
    public getMusicGenre(){
        return this.musicGenre
    }
    public getResponsible(){
        return this.responsible
    }
}