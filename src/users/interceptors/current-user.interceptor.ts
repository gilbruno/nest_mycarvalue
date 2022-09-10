import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {

    constructor(private userService: UsersService) {}

    /**
     * 
     * @param context : wrapper of incoming request
     * @param next 
     */
    async intercept(context: ExecutionContext, next: CallHandler<any>) {

        const request = context.switchToHttp().getRequest()
        const {userId} = request.session || {}
        request.currentUser = userId

        if (userId) {

        }

        return next.handle()

        // throw new Error("Method not implemented.");
    }

}