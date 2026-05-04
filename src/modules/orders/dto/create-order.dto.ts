import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';

export class CreateOrderItemDto {
    @IsString()
    @IsNotEmpty()
    productName!: string;

    @IsNumber()
    @Min(1)
    quantity!: number;

    @IsNumber()
    @Min(0)
    unitPrice!: number;
}

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    userId!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items!: CreateOrderItemDto[];
}
