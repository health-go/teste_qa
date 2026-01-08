export const parseTimestamp = (timeString: string) => {
    const today = new Date()
    const [time, milliseconds = "0"] = timeString.split(".")
    const [hours, minutes, seconds] = time.split(":").map(Number)

    const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        hours,
        minutes,
        seconds,
        Number(milliseconds) * 10,
    )
    return date
}
