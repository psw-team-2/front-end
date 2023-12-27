export interface ClubMessageWihtUser {
    id?: number,
    userId?: number,
    clubId?: number,
    time: Date,
    text: string
    userName: string;
    userSurname: string;
    image: string;
  }