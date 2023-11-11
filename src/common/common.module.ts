import { Module } from '@nestjs/common';
import { Hasher } from './adapters';

@Module({
  providers: [Hasher],
  exports: [Hasher],
})
export class CommonModule {}
