import { Category } from './category';

export class Complaint {
    constructor(
        public id: number = null,
        public user_id: number = null,
        public category_id: number = null,
        public state_id: number = null,
        public original_id: number = null,
        public description: string = null,
        public latitude: number = null,
        public longitude: number = null,
        public created_at: Date = null,
        public category: Category = null
    ) {}
}
