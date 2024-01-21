export class Product {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public imageUrl: string,
    public description: string,
    public quantity: number = 0,
    public comments: string[] = [],
    public priceInSelectedCurrency: number,
  ) {}
}
