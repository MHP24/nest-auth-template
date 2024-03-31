import * as bcrypt from 'bcrypt';
import { HasherAdapter } from './interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Hasher implements HasherAdapter {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
