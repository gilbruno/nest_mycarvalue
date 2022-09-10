import { 
    Body, Controller, Post, Get, 
    Delete,  Patch, Param, Query, 
    NotFoundException, Session, UseInterceptors
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './user.entity';

@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {

    constructor(private usersService: UsersService, private authService: AuthService) {
    }

    /**
     * Functions to test cookie creation
     * @param color 
     * @param session 
     */
    @Get('/colors/:color')
    setColor(@Param('color') color: string, @Session() session: any) {
        session.color = color
    }

    @Get('/colors')
    getColor(@Session() session: any) {
        return session.color
    }

    // @Get('/whoami')
    // whoAmI(@Session() session: any) {
    //     return this.usersService.findOne(session.userId)
    // }

    @Get('/whoami')
    whoAmI(@CurrentUser() user: User) {
        return user
    }

    @Post('signout')
    signOut(@Session() session: any) {
        session.userId = null
    }

    @Post('signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        console.log(body)
        const user = await this.authService.signup(body.email, body.password)
        session.userId = user.id
        return user
    }    

    @Post('signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password)
        session.userId = user.id
        return user
    }    

    @Get('/:id')
    async findUser(@Param('id') id:string) {
        console.log('handler is running')
        const user = await this.usersService.findOne(parseInt(id))
        if (!user) {
            throw new NotFoundException('user not found')
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email)
    }

    @Delete('/:id')
    removeUser(@Param('id') id:string) {
        return this.usersService.remove(parseInt(id))
    }

    @Patch('/:id')
    updateUser(@Param('id') id:string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }
}
