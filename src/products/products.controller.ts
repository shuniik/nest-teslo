import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/pagination.dt';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/auth.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities';


@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  @ApiResponse({status:201, description:'Product was created', type:Product})
  @ApiResponse({status:400, description:'Bad Request'})
  @ApiResponse({status:403, description:'Forbidden. Token related'})
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user:User
    
  ) {
    return this.productsService.create(createProductDto,user);
  }

  @Get()
  findAll(@Query() paginationDto:PaginationDto) {
    console.log(paginationDto);
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user:User
  ) {
    return this.productsService.update(id, updateProductDto,user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
