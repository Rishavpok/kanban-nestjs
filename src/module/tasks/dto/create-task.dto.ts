import { IsString } from "class-validator";


export class CreateTasksDto {

    @IsString()
    title : string

    @IsString()
    description : string;

    @IsString()
    status: string

    @IsString()
    priority: string


}