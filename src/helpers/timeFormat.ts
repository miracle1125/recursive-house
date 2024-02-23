import moment, { Moment } from 'moment-timezone';
import pluralize from 'pluralize';
import roundNumber from './utils';

/**
 * Calculate the time has passed since the datetime prop. Return in this format: 1m, 1h, 1d
 * @param datetime Date | string | number
 * @returns time in this format: 1m, 1h, 1d
 */
export const formatTimePassed = (datetime: Date | string | number) => {
  const momentDatetime = moment(datetime);
  const duration = moment.duration(moment().diff(momentDatetime));

  if (duration.asMinutes() < 60) {
    return Math.round(duration.asMinutes()) + 'm';
  } else if (duration.asDays() < 1) {
    return Math.round(duration.asHours()) + 'h';
  } else if (duration.asDays() < 31) {
    return Math.round(duration.asDays()) + 'd';
  } else {
    return Math.round(duration.asMonths()) + 'mo';
  }
};

export enum TimeInSeconds {
  ONE_MINUTE = 60,
  ONE_HOUR = 60 * 60,
  ONE_DAY = 24 * 60 * 60,
  THIRTY_DAYS = 30 * 24 * 60 * 60,
}

export enum TimeInMilliseconds {
  ONE_SECOND = 1000,
  ONE_MINUTE = 1000 * 60,
  ONE_HOUR = 1000 * 60 * 60,
  ONE_DAY = 1000 * 24 * 60 * 60,
  THIRTY_DAYS = 1000 * 30 * 24 * 60 * 60,
}

export enum TimeUnit {
  SECOND = 'second',
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
}

export const TODAY = moment();
export const DAY_AGO = TODAY.clone().subtract(1, 'day');
export const WEEK_AGO = TODAY.clone().subtract(1, 'weeks');
export const TWO_WEEK_AGO = TODAY.clone()
  .subtract(2, 'weeks')
  .startOf('isoWeek');
export const THREE_WEEK_AGO = TODAY.clone()
  .subtract(3, 'weeks')
  .startOf('isoWeek');
export const MONTH_AGO = TODAY.clone().subtract(1, 'months').startOf('isoWeek');
export const THREE_MONTH_AGO = TODAY.clone()
  .subtract(3, 'months')
  .startOf('isoWeek');
export const SIX_MONTH_AGO = TODAY.clone()
  .subtract(6, 'months')
  .startOf('isoWeek');
export const TWELVE_MONTH_AGO = TODAY.clone()
  .subtract(12, 'months')
  .startOf('isoWeek');

export const TWELVE_MONTH_LATER = TODAY.clone()
  .add(12, 'months')
  .endOf('isoWeek');

/**
 * Calculate the milliseconds. Return in this format: 1m, 1h, 1d, 1 minute, 1 hour, 1 day
 * @param milliseconds number
 * @param fullText boolean. If it should show the whole text "seconds"
 * @returns time in this format: 1m, 1h, 1d
 */
export const formatDuration = (milliseconds: number, fullText?: boolean) => {
  if (Number.isNaN(milliseconds)) {
    return '';
  }

  const seconds = milliseconds / 1000;

  if (seconds < TimeInSeconds.ONE_MINUTE) {
    const roundedSeconds = Math.round(seconds);
    return fullText
      ? `${roundedSeconds} ${pluralize('second', roundedSeconds)}`
      : `${roundedSeconds}s`;
  } else if (seconds < TimeInSeconds.ONE_HOUR) {
    const minutes = Math.round(seconds / TimeInSeconds.ONE_MINUTE);
    return fullText
      ? `${minutes} ${pluralize('minute', minutes)}`
      : `${minutes}m`;
  } else if (seconds < TimeInSeconds.ONE_DAY) {
    const hours = Math.round(seconds / TimeInSeconds.ONE_HOUR);
    return fullText ? `${hours} ${pluralize('hour', hours)}` : `${hours}h`;
  } else if (seconds < TimeInSeconds.THIRTY_DAYS) {
    const days = Math.round(seconds / TimeInSeconds.ONE_DAY);
    return fullText ? `${days} ${pluralize('day', days)}` : `${days}d`;
  } else {
    const months = Math.round(seconds / TimeInSeconds.THIRTY_DAYS);
    return fullText ? `${months} ${pluralize('month', months)}` : `${months}mo`;
  }
};

export const convertMillisecondsToTargetUnit = (
  milliseconds: number,
  targetUnit: TimeUnit,
) => {
  switch (targetUnit) {
    case TimeUnit.SECOND:
      return roundNumber(milliseconds / TimeInMilliseconds.ONE_SECOND);
    case TimeUnit.MINUTE:
      return roundNumber(milliseconds / TimeInMilliseconds.ONE_MINUTE);
    case TimeUnit.HOUR:
      return roundNumber(milliseconds / TimeInMilliseconds.ONE_HOUR);
    case TimeUnit.DAY:
      return roundNumber(milliseconds / TimeInMilliseconds.ONE_DAY);
    default:
      return 0;
  }
};

/**
 * Get time unit when it reaches the relative threshold
 * Max is Day. Min is Second
 * WARNING: Don't change the max unit if you're not planning to optimize the metrics
 */
export const getTimeUnitThreshold = (milliseconds: number) => {
  if (milliseconds > TimeInMilliseconds.ONE_DAY) {
    return TimeUnit.DAY;
  } else if (milliseconds > TimeInMilliseconds.ONE_HOUR) {
    return TimeUnit.HOUR;
  } else if (milliseconds > TimeInMilliseconds.ONE_MINUTE) {
    return TimeUnit.MINUTE;
  } else if (milliseconds > TimeInMilliseconds.ONE_SECOND) {
    return TimeUnit.SECOND;
  } else {
    return TimeUnit.SECOND;
  }
};

export const convertMillisecondsToDays = (milliseconds: number | null) => {
  if (milliseconds !== null) {
    const days = roundNumber(milliseconds / TimeInMilliseconds.ONE_DAY);
    return days;
  }
  return 0;
};

export const getDateValueWithoutUtcOffset = (date: string | number) => {
  const momentDate = moment(date);
  return momentDate.utc().add(momentDate.utcOffset(), 'm');
};

export type DateObject = {
  label: string;
  startDate: Moment;
  endDate: Moment;
  isCurrent: boolean;
  isWeekend?: boolean;
  timePassedPercentage: number;
  daysInMonth?: number;
};

export const getMonthsBetweenDates = (
  startDate: Moment | Date,
  endDate: Moment | Date,
) => {
  const months: DateObject[] = [];
  const cursorDate = moment(startDate);
  const now = moment();
  while (cursorDate.isSameOrBefore(endDate, 'month')) {
    const isCurrentYear = cursorDate.isSame(now, 'year');
    const isCurrentMonth = cursorDate.isSame(now, 'month');
    const label = cursorDate.format(isCurrentYear ? 'MMMM' : 'YYYY MMMM');
    const startOfMonth = cursorDate.clone().startOf('month');
    const endOfMonth = cursorDate.clone().endOf('month');
    const daysInMonth = cursorDate.daysInMonth();
    const totalMonthDuration = endOfMonth.diff(startOfMonth);
    const elapsedMonthDuration = now.diff(startOfMonth);
    const timePassedPercentage =
      isCurrentMonth && totalMonthDuration
        ? elapsedMonthDuration / totalMonthDuration
        : 0;

    months.push({
      label,
      startDate: startOfMonth,
      endDate: endOfMonth,
      isCurrent: isCurrentMonth,
      timePassedPercentage,
      daysInMonth,
    });

    cursorDate.add(1, 'month');
  }

  return months;
};

const QUARTER_LABELS = {
  Q1: 'Jan - Mar',
  Q2: 'Apr - Jun',
  Q3: 'Jul - Sep',
  Q4: 'Oct - Dec',
};

export const getQuarterBetweenDates = (
  startDate: Moment | Date,
  endDate: Moment | Date,
) => {
  const quarters: DateObject[] = [];
  const cursorDate = moment(startDate);
  const now = moment();
  while (cursorDate.isSameOrBefore(endDate, 'quarter')) {
    const isCurrentYear = cursorDate.isSame(now, 'year');
    const isCurrentQuarter = cursorDate.isSame(now, 'quarter');
    const year = cursorDate.format('YYYY');
    const quarterNo = `Q${cursorDate.format('Q')}`;
    const label = `${
      QUARTER_LABELS[quarterNo as keyof typeof QUARTER_LABELS]
    } (${isCurrentYear ? quarterNo : `${quarterNo}, ${year}`})`;
    const startOfQuarter = cursorDate.clone().startOf('quarter');
    const endOfQuarter = cursorDate.clone().endOf('quarter');

    const totalQuarterDuration = endOfQuarter.diff(startOfQuarter);
    const elapsedQuarterDuration = now.diff(startOfQuarter);
    const timePassedPercentage =
      isCurrentQuarter && totalQuarterDuration
        ? elapsedQuarterDuration / totalQuarterDuration
        : 0;

    quarters.push({
      label,
      startDate: startOfQuarter,
      endDate: endOfQuarter,
      isCurrent: isCurrentQuarter,
      timePassedPercentage,
    });

    cursorDate.add(1, 'quarter');
  }

  return quarters;
};

export const getDaysBetweenDates = (
  startDate: Moment | Date,
  endDate: Moment | Date,
) => {
  const days: DateObject[] = [];
  const cursorDate = moment(startDate).startOf('month');
  const now = moment();
  while (cursorDate.isSameOrBefore(endDate, 'day')) {
    const isCurrentDay = cursorDate.isSame(now, 'day');
    const isWeekend = Number(cursorDate.format('E')) >= 6;
    const label = cursorDate.format('D');
    const startOfDay = cursorDate.clone().startOf('day');
    const endOfDay = cursorDate.clone().endOf('day');

    const totalDayDuration = endOfDay.diff(startOfDay);
    const elapsedDayDuration = now.diff(startOfDay);
    const timePassedPercentage =
      isCurrentDay && totalDayDuration
        ? elapsedDayDuration / totalDayDuration
        : 0;

    days.push({
      label,
      startDate: startOfDay,
      endDate: endOfDay,
      isCurrent: isCurrentDay,
      timePassedPercentage,
      isWeekend,
    });

    cursorDate.add(1, 'day');
  }

  return days;
};

type SimpleDateObject = {
  startDate: Moment | Date | number;
  endDate: Moment | Date | number;
};

export const getWeekendsBetweenDates = (
  startDate: Moment | Date | number,
  endDate: Moment | Date | number,
) => {
  const ranges: SimpleDateObject[] = [];
  let cursorDate = moment(startDate);

  while (cursorDate.isBefore(endDate)) {
    const startOfWeekend = moment(cursorDate).day(6).startOf('day');
    const endOfWeekend = moment(startOfWeekend).day(7).endOf('day');
    if (startOfWeekend.isAfter(endDate)) {
      break;
    }
    if (endOfWeekend.isAfter(endDate)) {
      ranges.push({ startDate: startOfWeekend.toDate().getTime(), endDate });
    } else {
      ranges.push({
        startDate: startOfWeekend.toDate().getTime(),
        endDate: endOfWeekend.toDate().getTime(),
      });
    }

    cursorDate = moment(endOfWeekend).add(1, 'days');
  }

  return ranges;
};
