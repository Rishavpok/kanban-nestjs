import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTasksDto } from './dto/create-task.dto';
import { UpdateTasksDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getAllTasks( userId : number , status : string) {
    const tasks = await this.prisma.task.findMany({
        where : { userId ,  ...(status && { status }),},
    })
    return {
        data : tasks
    }
  }

  async createTask(dto: CreateTasksDto, userId: number) {
    try {
      const task = await this.prisma.task.create({
        data: {
          userId,
          title: dto.title,
          description: dto.description,
          status: dto.status,
          priority: dto.priority,
        },
      });

      return {
        message: 'Task added successfully',
        task,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateTask(id: number, task: UpdateTasksDto) {
    const exist = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!exist) {
      throw new HttpException('Task not found', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.prisma.task.update({
        where: { id },
        data: task,
      });

      return {
        message: 'Task updated successfully',
        task,
      };
    } catch (e) {
      throw new HttpException(
        'Failed to update task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

async deleteTask(userId: number, id: number) {
  // check if the task exists and belongs to the user
  const task = await this.prisma.task.findFirst({
    where: { id, userId },
  });

  if (!task) {
    throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
  }

  // delete the task
  await this.prisma.task.delete({
    where: { id },
  });

  return { message: 'Task deleted successfully' };
}
}
