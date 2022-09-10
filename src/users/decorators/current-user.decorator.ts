import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { request } from "http";

/**
 * Param decorators exist OUTSIDE the Dependency Injection (DI) System
 * So our decorator can not get an instance of UserService.
 * That's why we need an Interceptor.
 * An Interceptor will get the current user then use the value produced by it
 * in the Decorator
 */
export const CurrentUser = createParamDecorator(

    //ExecutionContext is the context of incoming request.
    // It can be http request, websocket request or any communication protocol
    // NB : 'data' represents the argument we pass in the annotation @CurrentUser
    // Ex : @CurrentUser('HEY') ==> data will be equal to 'HEY' if the type is 'any'
    // If type is'never' we cannot provide any argument to the decorator
    (data: never, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()
        return request.currentUser
        console.log(request.session.userId)
        return 'hi there !'
    }

)