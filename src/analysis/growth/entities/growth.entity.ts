import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class IncomeStatement {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  symbol: string;
  @Column()
  date: string;
  @Column()
  reportedCurrency: string;
  @Column()
  cik: string;
  @Column()
  fillingDate: string;
  @Column()
  acceptedDate: string;
  @Column()
  calendarYear: string;
  @Column()
  period: string;
  @Column()
  revenue: number;
  @Column()
  costOfRevenue: number;
  @Column()
  grossProfit: number;
  @Column()
  grossProfitRatio: number;
  @Column()
  researchAndDevelopmentExpenses: number;
  @Column()
  generalAndAdministrativeExpenses: number;
  @Column()
  sellingAndMarketingExpenses: number;
  @Column()
  sellingGeneralAndAdministrativeExpenses: number;
  @Column()
  otherExpenses: number;
  @Column()
  operatingExpenses: number;
  @Column()
  costAndExpenses: number;
  @Column()
  interestIncome: number;
  @Column()
  interestExpense: number;
  @Column()
  depreciationAndAmortization: number;
  @Column()
  ebitda: number;
  @Column()
  ebitdaratio: number;
  @Column()
  operatingIncome: number;
  @Column()
  operatingIncomeRatio: number;
  @Column()
  totalOtherIncomeExpensesNet: number;
  @Column()
  incomeBeforeTax: number;
  @Column()
  incomeBeforeTaxRatio: number;
  @Column()
  incomeTaxExpense: number;
  @Column()
  netIncome: number;
  @Column()
  netIncomeRatio: number;
  @Column()
  eps: number;
  @Column()
  epsdiluted: number;
  @Column()
  weightedAverageShsOut: number;
  @Column()
  weightedAverageShsOutDil: number;
  @Column({ nullable: true })
  link: string;
  @Column({ nullable: true })
  finalLink: string;
  @Column()
  index: string;
}
// "date": "2020-09-26",
// "symbol": "AAPL",
// "reportedCurrency": "USD",
// "cik": "0000320193",
// "fillingDate": "2020-10-30",
// "acceptedDate": "2020-10-29 18:06:25",
// "calendarYear": "2020",
// "period": "FY",
// "revenue": 274515000000,
// "costOfRevenue": 169559000000,
// "grossProfit": 104956000000,
// "grossProfitRatio": 0.3823324773,
// "researchAndDevelopmentExpenses": 18752000000,
// "generalAndAdministrativeExpenses": 0,
// "sellingAndMarketingExpenses": 0,
// "sellingGeneralAndAdministrativeExpenses": 19916000000,
// "otherExpenses": 87000000,
// "operatingExpenses": 38755000000,
// "costAndExpenses": 208314000000,
// "interestIncome": 3763000000,
// "interestExpense": 2873000000,
// "depreciationAndAmortization": 11056000000,
// "ebitda": 77344000000,
// "ebitdaratio": 0.2817478098,
// "operatingIncome": 66288000000,
// "operatingIncomeRatio": 0.2414731435,
// "totalOtherIncomeExpensesNet": 803000000,
// "incomeBeforeTax": 67091000000,
// "incomeBeforeTaxRatio": 0.2443983025,
// "incomeTaxExpense": 9680000000,
// "netIncome": 57411000000,
// "netIncomeRatio": 0.2091361128,
// "eps": 3.31,
// "epsdiluted": 3.28,
// "weightedAverageShsOut": 17352119000,
// "weightedAverageShsOutDil": 17528214000,
// "link": "https://www.sec.gov/Archives/edgar/data/320193/000032019320000096/0000320193-20-000096-index.htm",
// "finalLink": "https://www.sec.gov/Archives/edgar/data/320193/000032019320000096/aapl-20200926.htm"
