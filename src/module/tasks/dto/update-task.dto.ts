import { PartialType } from '@nestjs/mapped-types';
import { CreateTasksDto } from './create-task.dto';


export class UpdateTasksDto extends PartialType(CreateTasksDto) {}