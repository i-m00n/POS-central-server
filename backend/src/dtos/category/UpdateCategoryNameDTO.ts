import { IsString, IsNotEmpty } from "class-validator";

export class UpdateCategoryNameDTO {
  @IsString()
  @IsNotEmpty()
  currentName: string;

  @IsString()
  @IsNotEmpty()
  newName: string;
}
