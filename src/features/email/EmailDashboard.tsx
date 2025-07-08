import { useMemo, useState } from "react";
import { useEmails, useUpdateEmailFlags } from "@/queries/emailQueries";
import type { Email, EmailQueryParams } from "@/types/emailTypes";
import Filters from "./Filters";
import PaginationControls from "@/components/global/Pagination";
import EmailTable from "./EmailTable";
import { filterData } from "@/api/emails";

const DEFAULT_PARAMS: EmailQueryParams = {
	page: 1,
	limit: 25,
	sortBy: "date",
	sortDir: "desc",
};

export default function EmailDashboard() {
	const [params, setParams] = useState<EmailQueryParams>(DEFAULT_PARAMS);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const { data: emails, isPending } = useEmails();
	const { mutate: updateFlags } = useUpdateEmailFlags();

	const { pageData, filteredAllIds } = useMemo(() => {
		if (!emails) {
			return {
				pageData: {
					emails: [] as Email[],
					meta: { page: 1, limit: params.limit ?? 25, total: 0, totalPages: 1 },
				},
				filteredAllIds: [] as string[],
			};
		}

		const pageData = filterData(emails, params);

		const allIds = filterData(emails, {
			...params,
			limit: emails.length,
			page: 1,
		}).emails.map((email) => email.id);

		return { pageData, filteredAllIds: allIds };
	}, [emails, params]);

	const handlePageChange = (page: number) =>
		setParams((param) => ({ ...param, page }));

	const toggleSelectAll = () =>
		setSelectedIds(
			selectedIds.length === filteredAllIds.length ? [] : filteredAllIds
		);
	return (
		<div className="m-8 p-8 flex flex-col gap-4 rounded-xl border shadow-sm">
			<Filters params={params} setParams={setParams} />

			<EmailTable
				emails={pageData.emails}
				allIds={filteredAllIds}
				selectedIds={selectedIds}
				setSelectedIds={setSelectedIds}
				toggleSelectAll={toggleSelectAll}
				loading={isPending}
				onUpdate={updateFlags}
				sortBy={params.sortBy}
				sortDir={params.sortDir}
				onSortChange={(field) =>
					setParams((p) => ({
						...p,
						sortBy: field as EmailQueryParams["sortBy"],
						sortDir:
							p.sortBy === field
								? p.sortDir === "asc"
									? "desc"
									: "asc"
								: "asc",
					}))
				}
			/>

			{pageData.emails.length > 0 && (
				<PaginationControls
					currentPage={pageData.meta.page}
					totalPages={pageData.meta.totalPages}
					handlePageChange={handlePageChange}
				/>
			)}
		</div>
	);
}
