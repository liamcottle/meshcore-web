import moment from "moment";

class TimeUtils {

    static formatUnixSecondsAgo(unixSeconds) {

        // check if date is known
        if(unixSeconds > 0){
            return TimeUtils.getTimeAgoShortHand(moment.unix(unixSeconds).toDate());
        }

        return "Unknown";

    }

    static formatMessageTimestamp(unixMilliseconds) {

        // convert millis to moment date
        const date = moment.unix(unixMilliseconds / 1000);

        // check if message date is same as today
        const isSameDate = date.isSame(moment(), 'day');

        // short format for messages from today
        if(isSameDate){
            return date.format("hh:mm A");
        }

        // long format for all other messages
        return date.format("DD/MMM/YYYY hh:mm A");

    }

    static secondsToDateTimeString(unixSeconds) {
        const date = moment.unix(unixSeconds);
        return date.format("DD/MMM/YYYY hh:mm A");
    }

    static millisecondsToDateTimeString(unixMilliseconds) {
        const date = moment.unix(unixMilliseconds / 1000);
        return date.format("DD/MMM/YYYY hh:mm A");
    }

    static getTimeAgoShortHand(date) {

        // get duration between now and provided date
        const duration = moment.duration(moment().diff(date));

        // years
        const years = Math.floor(duration.asYears());
        if(years > 0){
            return `${years} ${years === 1 ? 'year' : 'years'} ago`;
        }

        // months
        const months = Math.floor(duration.asMonths());
        if(months > 0){
            return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        }

        // weeks
        const weeks = Math.floor(duration.asWeeks());
        if(weeks > 0){
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        }

        // days
        const days = Math.floor(duration.asDays());
        if(days > 0){
            return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        }

        // hours
        const hours = Math.floor(duration.asHours());
        if(hours > 0){
            return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        }

        // minutes
        const minutes = Math.floor(duration.asMinutes());
        if(minutes > 0){
            return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;
        }

        return "now";

    };

}

export default TimeUtils;
