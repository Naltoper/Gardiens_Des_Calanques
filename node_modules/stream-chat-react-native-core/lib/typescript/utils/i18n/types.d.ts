import { Streami18n } from './Streami18n';
export type FormatterFactory<V> = (streamI18n: Streami18n) => (value: V, lng: string | undefined, options: Record<string, unknown>) => string;
export type CustomFormatters = Record<string, FormatterFactory<any>>;
/**
 * import dayjs from 'dayjs';
 * import duration from 'dayjs/plugin/duration';
 *
 * dayjs.extend(duration);
 *
 * // Basic formatting
 * dayjs.duration(1000).format('HH:mm:ss'); // "00:00:01"
 * dayjs.duration(3661000).format('HH:mm:ss'); // "01:01:01"
 *
 * // Different format tokens
 * dayjs.duration(3661000).format('D[d] H[h] m[m] s[s]'); // "0d 1h 1m 1s"
 * dayjs.duration(3661000).format('D [days] H [hours] m [minutes] s [seconds]'); // "0 days 1 hours 1 minutes 1 seconds"
 *
 * // Zero padding
 * dayjs.duration(1000).format('HH:mm:ss'); // "00:00:01"
 * dayjs.duration(1000).format('H:m:s'); // "0:0:1"
 *
 * // Different units
 * dayjs.duration(3661000).format('D'); // "0"
 * dayjs.duration(3661000).format('H'); // "1"
 * dayjs.duration(3661000).format('m'); // "1"
 * dayjs.duration(3661000).format('s'); // "1"
 *
 * // Complex examples
 * dayjs.duration(3661000).format('DD:HH:mm:ss'); // "00:01:01:01"
 * dayjs.duration(3661000).format('D [days] HH:mm:ss'); // "0 days 01:01:01"
 * dayjs.duration(3661000).format('H[h] m[m] s[s]'); // "1h 1m 1s"
 *
 * // Negative durations
 * dayjs.duration(-3661000).format('HH:mm:ss'); // "-01:01:01"
 *
 * // Long durations
 * dayjs.duration(86400000).format('D [days]'); // "1 days"
 * dayjs.duration(2592000000).format('M [months]'); // "30 months"
 *
 *
 * Format tokens:
 * D - days
 * H - hours
 * m - minutes
 * s - seconds
 * S - milliseconds
 * M - months
 * Y - years
 * You can also use:
 * HH, mm, ss for zero-padded numbers
 * [text] for literal text
 */
export type DurationFormatterOptions = {
    format?: string;
    withSuffix?: boolean;
};
export type TimestampFormatterOptions = {
    calendar?: boolean | null;
    calendarFormats?: Record<string, string>;
    format?: string;
    withSuffix?: boolean;
};
export type PredefinedFormatters = {
    durationFormatter: FormatterFactory<string>;
    timestampFormatter: FormatterFactory<string | Date>;
};
//# sourceMappingURL=types.d.ts.map