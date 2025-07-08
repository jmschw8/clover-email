import dayjs from "dayjs";

export const formatDate = (
	date: Date,
	dateFormat: string = "MM/DD/YYYY hh:mm A"
) => {
	return dayjs(date).format(dateFormat);
};
