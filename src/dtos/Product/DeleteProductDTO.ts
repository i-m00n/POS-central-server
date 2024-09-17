import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
