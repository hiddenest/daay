import dayjs from 'dayjs';
import dayjsPluginIsBetween from 'dayjs/plugin/isBetween';
import dayjsPluginUTC from 'dayjs/plugin/utc';
import dayjsPluginLocaleData from 'dayjs/plugin/localeData';
import dayjsPluginIsoWeek from 'dayjs/plugin/isoWeek';
import dayjsPluginWeekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(dayjsPluginIsBetween);
dayjs.extend(dayjsPluginUTC);
dayjs.extend(dayjsPluginLocaleData);
dayjs.extend(dayjsPluginIsoWeek);
dayjs.extend(dayjsPluginWeekOfYear);
