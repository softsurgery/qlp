import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { ResponseUserDto } from '../dtos/user/response-user.dto';
import { UpdateUserDto } from '../dtos/user/update-user.dto';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/app/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';
import { CreateUserDto } from '../dtos/user/create-user.dto';

@ApiTags('user')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({ version: '1', path: '/user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findOne(@Query() query: IQueryObject): Promise<ResponseUserDto | null> {
    return toDto(ResponseUserDto, await this.userService.findOneByCondition(query));
  }

  @Get('/list')
  @ApiPaginatedResponse(ResponseUserDto)
  async findAllPaginated(@Query() query: IQueryObject): Promise<PageDto<ResponseUserDto>> {
    const paginated = await this.userService.findAllPaginated(query);
    return { ...paginated, data: toDtoArray(ResponseUserDto, paginated.data) };
  }

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseUserDto[]> {
    const users = await this.userService.findAll(options);
    return toDtoArray(ResponseUserDto, users);
  }

  @Get('/email/:email')
  async findOneByEmail(@Param('email') email: string): Promise<ResponseUserDto | null> {
    return toDto(ResponseUserDto, await this.userService.findOneByEmail(email));
  }

  @Get('/current')
  async findCurrentUser(@Request() req: AdvancedRequest): Promise<ResponseUserDto | null> {
    if (!req.user?.sub) throw new UnauthorizedException();
    return toDto(ResponseUserDto, await this.userService.findOneById(req.user?.sub));
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: string,
    @Query() query: IQueryObject,
  ): Promise<ResponseUserDto | null> {
    return toDto(ResponseUserDto, await this.userService.findOneById(id, query.join));
  }

  @Post()
  @LogEvent(EventType.USER_CREATED)
  async create(
    @Body() createUserDto: CreateUserDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseUserDto> {
    const user = toDto(ResponseUserDto, await this.userService.save(createUserDto));
    req.logInfo = { id: user.id, firstName: user.firstName };
    return user;
  }

  @Put(':id')
  @LogEvent(EventType.USER_UPDATED)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseUserDto | null> {
    const user = await this.userService.update(id, updateUserDto);
    req.logInfo = { id: user?.id, firstName: user?.firstName };
    return toDto(ResponseUserDto, user);
  }

  @Put('/activate/:id')
  @LogEvent(EventType.USER_ACTIVATED)
  async activate(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseUserDto | null> {
    const user = await this.userService.activate(id);
    req.logInfo = { id: user?.id, firstName: user?.firstName };
    return toDto(ResponseUserDto, user);
  }

  @Put('/deactivate/:id')
  @LogEvent(EventType.USER_DEACTIVATED)
  async deactivate(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseUserDto | null> {
    req.logInfo = { id };
    return toDto(ResponseUserDto, await this.userService.deactivate(id));
  }

  @Delete(':id')
  @LogEvent(EventType.USER_DELETED)
  async delete(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseUserDto | null> {
    const user = await this.userService.softDelete(id);
    req.logInfo = { id: user?.id, firstName: user?.firstName };
    return toDto(ResponseUserDto, user);
  }
}
