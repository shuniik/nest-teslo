import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product,ProductImage } from './entities/index';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports:[
    AuthModule,
    TypeOrmModule.forFeature([Product,ProductImage])//agregar el nombre de la entity aquí para que se cree en automático
  ],
  exports:[ProductsService,TypeOrmModule],
  
})
export class ProductsModule {}
