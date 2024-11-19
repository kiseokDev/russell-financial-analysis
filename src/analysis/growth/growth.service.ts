import { Injectable } from '@nestjs/common';
import { CreateGrowthDto } from './dto/create-growth.dto';
import { UpdateGrowthDto } from './dto/update-growth.dto';
import axios from 'axios';
import { parse } from 'csv-parse/sync';

@Injectable()
export class GrowthService {
  private readonly API_KEY = '4GtnUVtyfkRiiuCsH3VZLt2NgB2qRaxg';
  create(createGrowthDto: CreateGrowthDto) {
    return 'This action adds a new growth';
  }

  findAll() {
    return `This action returns all growth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} growth`;
  }

  update(id: number, updateGrowthDto: UpdateGrowthDto) {
    return `This action updates a #${id} growth`;
  }

  remove(id: number) {
    return `This action removes a #${id} growth`;
  }

  async getRussell2000Components() {
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
  private calculateEpsGrowthRate(financialData: FinancialStatement[]): number {
    if (financialData.length < 2) return 0;

    const latest_eps = financialData[0].epsdiluted;
    const oldest_eps = financialData[financialData.length - 1].epsdiluted;

    // EPS가 음수인 경우나 0인 경우 처리
    if (oldest_eps <= 0 || latest_eps <= 0) return 0;

    const years = financialData.length - 1;
    const growthRate = ((latest_eps / oldest_eps) ** (1 / years) - 1) * 100;
    return Number(growthRate.toFixed(2));
  }

  async getPegRatio(symbol: string) {
    try {
      const { data: financialData } = await axios.get<FinancialStatement[]>(
        `https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=annual&apikey=${this.API_KEY}`,
      );

      if (!financialData || financialData.length < 2) {
        return 'not enough data';
      }

      const currentPrice = await this.getCurrentPrice(symbol);
      const lastEps = financialData[0].epsdiluted;

      // PER 계산
      const per = Number((currentPrice / lastEps).toFixed(2));

      // EPS 성장률 계산
      const epsGrowthRate = this.calculateEpsGrowthRate(financialData);

      // PEG Ratio 계산 (성장률이 0이면 null 반환)
      const pegRatio =
        epsGrowthRate > 0 ? Number((per / epsGrowthRate).toFixed(2)) : null;

      return {
        symbol,
        pegRatio,
        per,
        epsGrowthRate,
        lastEps,
      };
    } catch (error) {
      console.error(`Error calculating PEG ratio for ${symbol}:`, error);
      return null;
    }
  }

  private async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const { data } = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${this.API_KEY}`,
      );
      return data[0]?.price || 0;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return 0;
    }
  }
}
export interface Stock {
  ticker: string;
  companyName: string;
  weight: number;
  sector?: string;
}
export interface FinancialStatement {
  date: string;
  symbol: string;
  reportedCurrency: string;
  epsdiluted: number;
  // 기타 필요한 재무제표 필드들
}
