export class Event{
    public id?: string;
    constructor(
        public title: string,
        public date: Date,
        public location: string,
        public ownerId: string
    ) {}
}