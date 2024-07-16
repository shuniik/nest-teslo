import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    
    @ApiProperty({
        example:'fb73c66f-c59d-44b8-b795-04828977251e',
        description:'User ID',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example:'hola@gmail.com',
        description:'User email',
        uniqueItems:true
    })
    @Column('text',{
        unique:true
    })
    email: string;

    @ApiProperty({
        example:'A213@dkh2ñl',
        description:'User password'
    })
    @Column('text',{
        select:false
    })
    password: string;

    @ApiProperty({
        example:'Juan Pablo Mateo',
        description:'User full name',
    })
    @Column('text')
    fullName: string;

    @Column('bool',{
        default:true
    })
    isActive: boolean

    @Column('text',{
        array:true,
        default:['user']
    })
    roles: string[]


    @OneToMany(
        () => Product,
        (product) => product.user
    )
    product: Product

    @BeforeInsert()
    checkFiledBeforeiNSERT(){
        this.email = this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFiledBeforeiNSERT()
    }

}
