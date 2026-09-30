import { SetMetadata } from '@nestjs/common';
import { EventType } from 'src/app/enums/event-type.enum';

// Define a custom decorator
export const LogEvent = (event: EventType) => SetMetadata('event', event);
