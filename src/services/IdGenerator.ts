import { v4 } from "uuid";

export default class IdGenerator {
    
    public static idGenerator(): string {
        return v4()
    }
} 