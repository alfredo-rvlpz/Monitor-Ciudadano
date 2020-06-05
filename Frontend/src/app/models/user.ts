export class User{
    constructor(
      public id: number = null,
      public role_id: number = null,
      public firstName: string = null,
      public lastName: string = null,
      public email: string = null,
      public photoUrl: string = null
    ) {}
}