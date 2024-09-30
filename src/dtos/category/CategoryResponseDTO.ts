import { ProductResponseDTO } from "../Product/ProductResponseDTO";

export class CategoryResponseDTO {
  name?: string;
  products?: ProductResponseDTO[];
}
