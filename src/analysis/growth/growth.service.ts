import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { parse } from 'csv-parse/sync';
import { RUSSEL_2000 } from 'src/common/russellList';
import { InjectRepository } from '@nestjs/typeorm';
import { IncomeStatement } from './entities/growth.entity';
import { Repository } from 'typeorm';
import yahooFinance from 'yahoo-finance2';

@Injectable()
export class GrowthService {
  // private readonly API_KEY = '4GtnUVtyfkRiiuCsH3VZLt2NgB2qRaxg';
  // private readonly API_KEY = 'UFPe8e9mkagHeYOoEkWDIEd9PkQJDZgE';
  private readonly API_KEY = 'XeBg3KSF3DfUOi7XgZrv3pspT1vMCx9Z';
  constructor(
    @InjectRepository(IncomeStatement)
    private IncomeStatementRepository: Repository<IncomeStatement>,
  ) {}

  async getRussell2000Components(): Promise<string[]> {
    try {
      // iShares IWM ETF 홀딩 데이터
      const response = await axios.get(
        'https://www.ishares.com/us/products/239710/ishares-russell-2000-etf/1467271812596.ajax?fileType=csv&fileName=IWM_holdings&dataType=fund',
      );
      const lines = response.data.split('\n');
      console.log(lines.slice(0, 20).join('\n')); // 첫 20줄을 출력하여 형식 확인

      // CSV 데이터 파싱
      const records = parse(lines.slice(9).join('\n'), {
        // 첫 9줄을 건너뛰고 파싱
        columns: true, // 첫 번째 행을 헤더로 사용
        skip_empty_lines: true,
        relax_column_count: true, // 열 개수 불일치 허용
      });

      // symbol만 추출
      const symbols = records
        .map((record: any) => record['Ticker'])
        .filter(
          (symbol: string | undefined) =>
            symbol && symbol !== '-' && symbol.trim() !== '',
        );
      return symbols.slice(0, -1);
    } catch (error) {
      console.error('Error fetching Russell 2000 components:', error);
      throw error;
    }
  }
  private calculateEpsGrowthRate(financialData): number {
    if (financialData.length < 2) return 0;

    const latest_eps = financialData[0].epsdiluted;
    const oldest_eps = financialData[financialData.length - 1].epsdiluted;

    // EPS가 음수인 경우나 0인 경우 처리
    if (oldest_eps <= 0 || latest_eps <= 0) return 0;

    const years = financialData.length - 1;
    const growthRate = ((latest_eps / oldest_eps) ** (1 / years) - 1) * 100;
    return Number(growthRate.toFixed(2));
  }

  async getIncomeStatement(symbol: string): Promise<any> {
    try {
      // const result = await yahooFinance.quoteSummary(symbol, {
      //   modules: ['earningsHistory'],
      // });
      // const result = await yahooFinance.quote(symbol);
      const result = await yahooFinance.fundamentalsTimeSeries(symbol, {
        period1: '2020-01-01',
        type: 'annual',
        module: 'financials',
      });

      return result;
    } catch (error) {
      console.error('Error fetching income statement for ${symbol}:', error);
      return null;
    }
  }

  quote(symbol: string) {
    return yahooFinance.quote(symbol);
  }

  // async getPegRatio(financialData) {
  //   try {
  //     if (!financialData || financialData.length < 2) {
  //       return 'not enough data';
  //     }

  //     const currentPrice = await this.getCurrentPrice(financialData);
  //     const lastEps = financialData[0].epsdiluted;

  //     // PER 계산
  //     const per = Number((currentPrice / lastEps).toFixed(2));

  //     // EPS 성장률 계산
  //     const epsGrowthRate = this.calculateEpsGrowthRate(financialData);

  //     // PEG Ratio 계산 (성장률이 0이면 null 반환)
  //     const pegRatio =
  //       epsGrowthRate > 0 ? Number((per / epsGrowthRate).toFixed(2)) : null;

  //     return {
  //       symbol,
  //       pegRatio,
  //       per,
  //       epsGrowthRate,
  //       lastEps,
  //     };
  //   } catch (error) {
  //     console.error(`Error calculating PEG ratio for ${symbol}:`, error);
  //     return null;
  //   }
  // }

  async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const data = await yahooFinance.quote(symbol);
      return data[0]?.regularMarketPrice || 0;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return 0;
    }
  }

  async getRussell2000IncomeStatements() {
    // const symbols = await this.getRussell2000Components();
    const symbols = RUSSEL_2000.slice(0, 10);
    //1~100length 까지만
    try {
      const incomeStatements = await Promise.all(
        symbols.map(async (symbol, index) => {
          await new Promise((resolve) => setTimeout(resolve, index * 100));
          const data = await this.getIncomeStatement(symbol);
          if (!data) return [];
          return data
            .map((item) => ({ ...item, symbol }))
            .filter((item) => {
              const date = new Date(item.date);
              return (
                date.getFullYear() >= 2024 || item.dilutedEPS !== undefined
              );
            });
        }),
      );
      return incomeStatements;

      //data 저장
    } catch (error) {
      console.error('Error fetching income statements:', error);
    }
    // const pegRatios = await Promise.all(
    //   symbols.map((symbol) => this.getPegRatio(symbol)),
    // );
    // return pegRatios;
  }
}
export interface Stock {
  ticker: string;
  companyName: string;
  weight: number;
  sector?: string;
}
