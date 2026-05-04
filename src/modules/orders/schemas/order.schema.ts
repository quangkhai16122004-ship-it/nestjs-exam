import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

export class OrderItem {
    productName: string;
    quantity: number;
    unitPrice: number;
}

@Schema({ timestamps: true })
export class Order {
    @Prop({ required: true })
    userId: string;

    @Prop({
        type: [{ productName: String, quantity: Number, unitPrice: Number }],
        required: true,
    })
    items: OrderItem[];

    @Prop({ required: true })
    totalPrice: number;

    @Prop({ type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' })
    status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
