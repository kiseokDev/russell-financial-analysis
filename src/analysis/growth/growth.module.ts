import { Module } from '@nestjs/common';
import { GrowthService } from './growth.service';
import { GrowthController } from './growth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeStatement } from './entities/growth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IncomeStatement])],
  controllers: [GrowthController],
  providers: [GrowthService],
})
export class GrowthModule {}
