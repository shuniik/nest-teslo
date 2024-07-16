import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/auth.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name:'products'})
export class Product {

    @ApiProperty({
        example:'fb73c66f-c59d-44b8-b795-04828977251e',
        description:'Product ID',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id:string

    @ApiProperty({
        example:'T-shit teslo',
        description:'Product Title',
        uniqueItems:true
    })
    @Column('text',{
        unique: true
    })
    title: string

    @ApiProperty({
        example:0,
        description:'Product price'
    })
    @Column('float',{
        default:0
    })
    price: number

    @ApiProperty({
        example:'Cupidatat tempor reprehenderit veniam proident quis veniam aliquip.',
        description:'Product description',
        default:null
    })
    @Column({
        type:'text',
        nullable:true
    })
    description: string

    @ApiProperty({
        example:'t_shirt_teslo',
        description:'Product SLUG - for SEO',
        uniqueItems:true
    })
    @Column('text',{
        unique:true
    })
    slug: string

    @ApiProperty({
        example:10,
        description:'Product stock',
        default:0
    })
    @Column('int',{
        default:0
    })
    stock:number

    @ApiProperty({
        example:['M','XL','XXL'],
        description:'Product sizes'
    })
    @Column('text',{
        array:true
    })
    sizes: string[]

    @ApiProperty({
        example:'Women',
        description:'Product gender',
        default:0
    })
    @Column('text')
    gender: string

    //tags 
    @ApiProperty()
    @Column('text',{
        array:true,
        default:[]
    })
    tags: string[]

    @ApiProperty()
    @OneToMany(

        () => ProductImage,
        productImage => productImage.product,
        { cascade: true,
            eager:true
        }
    )
    images? : ProductImage[]

    @ManyToOne(
        () => User,
        (user) => user.product,
        {eager:true}
        
    )
    user: User



    @BeforeInsert()
    checkslugInsert(){
        if(!this.slug){
            this.slug = this.title        
        }
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')

    }

    @BeforeUpdate()
    checkslugUpdate(){
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }




}
