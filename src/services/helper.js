import { DateTime as dt } from "luxon";

export function fromIsoToDateString(date) {
    if (date) {
        let output = dt.fromISO(date).toFormat('D');
        return output
    }
}

export function toIso() {
    let output = dt.toISO();
    return output
}
