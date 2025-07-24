export class Event{
    constructor(
        public title: string,
        public date: Date,
        public location: string,
        public ownerId: string
    ) {}
}