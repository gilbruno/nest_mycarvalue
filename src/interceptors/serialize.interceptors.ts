import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";


/**
 * Below is a pattern to represents any class
 */
interface ClassConstructor {
    new (...args: any[]):{}
}

/**
 * We create a decorator function in order to write concise annotation in our controller (@UseInterceptors(new SerializerInterceptor(UserDto)))
 * We will use instead '@Serialize(UserDto)'
 * @param dto 
 * @returns 
 */
export function Serialize(dto: any) {
    return UseInterceptors(new SerializerInterceptor(dto))
}

export class SerializerInterceptor implements NestInterceptor {
    
    constructor(private dto: any) {

    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        //Run something before a requetsis handled by the request handler
        //console.log("I'm running before the handler", context)

        return next.handle().pipe(
            map(
                (data: any) => {
                    //Run something before the response is sent out
                    //console.log("I'm running before the response is sent out", data)
                    return plainToClass(this.dto, data, {
                      excludeExtraneousValues: true  
                    })
                }
            )

        )
        //throw new Error("Method not implemented.");
    }

}