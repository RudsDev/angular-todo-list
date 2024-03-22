export class Todo {

  constructor(
    public id:number,
    public title:string,
    public description:string,
    public done:boolean,
  ) {}

  public isValid(): boolean {
    const { id, title, description } = this
    return Object.values({ id, title, description }).every(i => !!i)
  }

}
