import TimeAgo from "javascript-time-ago";

// English.
import en from 'javascript-time-ago/locale/en.json'

TimeAgo.addDefaultLocale(en)

function returnTimeAgo(timestamp: number) {
    return new TimeAgo('en-US').format(timestamp)
}


export {
    returnTimeAgo
}