import { Injectable } from '@nestjs/common';

import { AppLogger } from './shared/logger/logger.service';
import { RequestContext } from './shared/request-context/request-context.dto';

@Injectable()
export class AppService {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(AppService.name);
  }
}
