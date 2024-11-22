import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GrowthService } from './growth.service';
import { CreateGrowthDto } from './dto/create-growth.dto';
import { UpdateGrowthDto } from './dto/update-growth.dto';
import { QuoteSummaryResult } from 'yahoo-finance2/dist/esm/src/modules/quoteSummary-iface';

@Controller('growth')
export class GrowthController {
  constructor(private readonly growthService: GrowthService) {}

  @Get()
  findAll() {
    // return this.growthService.findAll();
    return this.growthService.getRussell2000Components();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.growthService.findOne(+id);
  // }

  // @Get('peg/:symbol')
  // getPegRatio(@Param('symbol') symbol: string) {
  //   console.log('symbol:', symbol);
  //   return this.growthService.getPegRatio(symbol);
  // }

  @Get('income-statement/:symbol')
  getIncomeStatement(@Param('symbol') symbol: string): Promise<any> {
    return this.growthService.getIncomeStatement(symbol);
  }

  @Get('quote/:symbol')
  getCurrentPrice(@Param('symbol') symbol: string) {
    return this.growthService.quote(symbol);
    // return this.growthService.getCurrentPrice(symbol);
  }

  @Get('russell2000')
  getRussell2000IncomeStatements() {
    return this.growthService.getRussell2000IncomeStatements();
  }
}
