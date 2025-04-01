import type {Instant} from "@js-joda/core";

export interface TimePeriod {
  start: Instant
  end: Instant
}

export interface RawForecast {
  pvOutputKW10: number
  pvOutputKW50: number
  pvOutputKW90: number
}

export type Confidence = 10 | 50 | 90

export class PeriodForecast {
  private period: TimePeriod
  private rawForecast: RawForecast

  public constructor(period: TimePeriod, forecast: RawForecast) {
    this.period = period
    this.rawForecast = forecast
  }

  public getTotalOutput(confidence: Confidence, baselineToSubtract = 0) {
    let kiloWattOutput: number
    if(confidence === 10) {
      kiloWattOutput = this.rawForecast.pvOutputKW10
    }
    else if(confidence === 50) {
      kiloWattOutput = this.rawForecast.pvOutputKW50
    }
    else {
      kiloWattOutput = this.rawForecast.pvOutputKW90
    }

    return (kiloWattOutput - baselineToSubtract) / 2
  }

  public getTimePeriod() {
    return this.period
  }
}

export class CumulativeForecast {
  private readonly periods: PeriodForecast[]
  private start: Instant
  private end: Instant

  public constructor(consecutivePeriods: PeriodForecast[]) {
    this.periods = consecutivePeriods
    this.start = consecutivePeriods[0].getTimePeriod().start
    this.end = this.start
    for(const period of consecutivePeriods) {
      if(period.getTimePeriod().start !== this.end) {
        throw new Error('Periods must be consecutive')
      }
      this.end = period.getTimePeriod().end
    }
  }

  public getTotalOutput(confidence: Confidence, baselineToSubtract = 0): number {
    return this.periods.reduce((acc, curr) => acc + curr.getTotalOutput(confidence, baselineToSubtract), 0)
  }
}

export class MultiArrayForecast {
  private readonly arrays: CumulativeForecast[]

  public constructor(arrays: CumulativeForecast[]) {
    this.arrays = arrays;
  }

  public getTotalOutput(confidence: Confidence, baselineToSubtract = 0): number {
    return this.arrays.reduce((acc, curr) => acc + curr.getTotalOutput(confidence, baselineToSubtract), 0)
  }
}
