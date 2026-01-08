import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/auth.guards';
import { TasksService } from './tasks.service';
import { CreateTasksDto } from './dto/create-task.dto';
import { UpdateTasksDto } from './dto/update-task.dto';


@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {

  constructor( private taskService : TasksService ) {}

  @Get()
  async getTasks( @Req() req : any ) {
    return this.taskService.getAllTasks( req.user.userId )
  }

  @Post()
  async create(@Body() task : CreateTasksDto , @Req() req: any ) {
      return this.taskService.createTask(task, req.user.userId)
  }

  @Patch(':id')
  async update(@Param('id') id :string , @Body() task : UpdateTasksDto  ) {
     return this.taskService.updateTask(Number(id), task)
  }

  @Delete(':id')
  async delete( @Param('id') id : string , @Req() req : any  ) {
    return this.taskService.deleteTask(Number(id), req.user.userId)
  }

}
