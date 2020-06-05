import { Complaint } from './complaint';
export class Marker {
    constructor(
        public latitude: number,
        public longitude: number,
        public icon: string = null,
        public complaint: Complaint = null
    ) {}
}
