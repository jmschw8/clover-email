import type { DateRange } from "react-day-picker";

export type EmailQueryParams = {
	limit?: number;
	page?: number;
	search?: string;
	date?: DateRange;
	sender?: string;
	subject?: string;
	sortBy?: string;
	sortDir?: string;
	isFavorite?: boolean;
};
export type Email = {
	id: string;
	sender: string;
	date: Date;
	subject: string;
	recipient: string;
	body: string;
	isFavorite?: boolean;
	isRead?: boolean;
};

export type EmailResponse = {
	emails: Email[];
	count: number;
	page: number;
	total: number;
	totalPages: number;
};
export type EmailAction = "add" | "remove";
