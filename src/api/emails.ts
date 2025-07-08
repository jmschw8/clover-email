import type { Email, EmailQueryParams } from "@/types/emailTypes";

type FlagMap = Record<string, { isFavorite?: boolean; isRead?: boolean }>;

export const loadFlaggedEmails = (): FlagMap =>
	JSON.parse(localStorage.getItem("emailFlags") ?? "{}");

export const saveFlaggedEmails = (id: string, payload: Partial<Email>) => {
	const emails = loadFlaggedEmails();
	emails[id] = { ...emails[id], ...payload };
	localStorage.setItem("emailFlags", JSON.stringify(emails));
};

export const filterData = (emails: Email[], params?: EmailQueryParams) => {
	const {
		limit = 25,
		page = 1,
		search,
		date,
		sender,
		subject,
		sortBy,
		sortDir,
		isFavorite,
	} = params || {};
	const normalize = (s: string) => s.toLowerCase();
	const qSearch = search ? normalize(search) : undefined;
	const qSender = sender ? normalize(sender) : undefined;
	const qSubject = subject ? normalize(subject) : undefined;

	const filtered = emails.filter((email) => {
		// Favorite is one-way- true, show favorites, false or undefined, show all
		if (isFavorite === true && email.isFavorite !== true) {
			return false;
		}
		// 'Search' looks at sender, subject, and body
		if (qSearch) {
			const unifiedSearch = `${email.sender} ${email.subject}`.toLowerCase();
			if (!unifiedSearch.includes(qSearch)) return false;
		}
		// More granular searching
		if (qSender && !normalize(email.sender).includes(qSender)) return false;
		if (qSubject && !normalize(email.subject).includes(qSubject)) return false;

		if (date) {
			const { from, to } = date;

			if (from && email.date < from) return false;
			if (to && email.date > to) return false;
		}
		return true;
	});

	let sorted = filtered;
	// handle sorting
	if (sortBy === "subject") {
		sorted = [...filtered].sort((a, b) => a.subject.localeCompare(b.subject));
	} else if (sortBy === "sender") {
		sorted = [...filtered].sort((a, b) => a.sender.localeCompare(b.sender));
	} else if (sortBy === "date") {
		sorted = [...filtered].sort(
			(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
		);
	}
	if (sortDir === "desc") sorted.reverse();

	const total = sorted.length;
	const totalPages = Math.ceil(total / limit);
	const start = (page - 1) * limit;
	const end = start + limit;
	const paginated = sorted.slice(start, end);

	return {
		emails: paginated,
		meta: {
			page,
			limit,
			total,
			totalPages,
		},
	};
};

export const fetchEmails = async (): Promise<Email[]> => {
	try {
		// mock delay for loading
		await new Promise((res) => setTimeout(res, 500));
		const res = await fetch("/data/emails.json");
		if (!res.ok) {
			throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
		}

		const data = (await res.json()) as Email[];
		// Mocking out the isRead/isFavorite functionality from LS
		const flags = loadFlaggedEmails();

		data.forEach((e: Email) => {
			const f = flags[e.id];
			e.isFavorite = f?.isFavorite ?? false;
			e.isRead = f?.isRead ?? false;
		});

		return data;
	} catch (error) {
		throw error instanceof Error
			? error
			: new Error("Unknown fetchEmails error");
	}
};
