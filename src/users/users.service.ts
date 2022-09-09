import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>) {
        
    }

    /**
     * We separate in 2 calling methods ('create' & 'save') 
     * in order to make hooks/decorators work (ex : AfterInsert)
     * @param email 
     * @param password 
     * @returns 
     */
    create(email: string, password: string) {
        const user = this.repo.create({email, password})

        return this.repo.save(user)
    }

    findOne(id: number) {
        return this.repo.findOne({
            where: {id: id}
        });
    }

    find(email: string) {
        return this.repo.findBy({email: email}
        );
    }

    /**
     * Use 'Partial' to provide 1 or many properties of the User entity
     * @param id 
     * @param attrs 
     */
    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id)
        if (!user) {
            throw new NotFoundException('user not found')
        }
        Object.assign(user, attrs)
        return this.repo.save(user)
    }

    async remove(id: number) {
        const user = await this.findOne(id)
        if (!user) {
            throw new NotFoundException('user not found')
        }
        return this.repo.remove(user)
    }
}
