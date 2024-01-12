// src/users/dto/pagination.dto.ts
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  pageId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  pageLimit?: number;
}
