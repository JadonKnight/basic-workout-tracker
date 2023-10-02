class Exercise {
  private id: number;
  private name: string;
  private description?: string;

  constructor(id: number, name: string, description?: string) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

export default Exercise;
