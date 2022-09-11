import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";


describe(
    'AuthService', () => {
        let service: AuthService;

        beforeEach(async () => {
            //Creata a fake copy of users service
            const fakeUsersService: Partial<UsersService> = {
                find: () => Promise.resolve([]),
                create: (email:string, password: string) => 
                    Promise.resolve({id: 1, email, password} as User)
                
            }
            
            //Create a DI container
            const module = await Test.createTestingModule({
                providers: [
                    AuthService,    
                    {
                        provide: UsersService,
                        useValue: fakeUsersService
                    }
                ]
            }).compile()
        
            service = module.get(AuthService)
        
        });
        
        it('can create an instance of auth service', async () => {
            expect(service).toBeDefined()
        })
        
        it('create a newuser with a salted and hash password', async () => {
            const password_test = 'asdf'
            const user = await service.signup('asf@asf.com', password_test)

            expect(user.password).not.toEqual(password_test)

            const [salt, hash] = user.password.split('.')
            expect(salt).toBeDefined()
            expect(hash).toBeDefined()

        })
    }
);


