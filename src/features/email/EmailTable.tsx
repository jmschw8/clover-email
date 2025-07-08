import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
	ArrowDown,
	ArrowUp,
	Ellipsis,
	Mail,
	MailOpen,
	Star,
	StarOff,
} from "lucide-react";
import { formatDate } from "@/utils";
import type { Email } from "@/types/emailTypes";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export type UpdateFlagsFn = (args: {
	id: string;
	payload: Partial<Pick<Email, "isFavorite" | "isRead">>;
}) => void;

// In reality, would have leveraged a table library to abstract much of this
type EmailTableProps = {
	emails?: Email[];
	allIds: string[];
	selectedIds: string[];
	setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
	toggleSelectAll: () => void;
	loading: boolean;
	onUpdate: UpdateFlagsFn;
	// Improvements: Type sortBy and sortDir explicitly
	sortBy?: string;
	sortDir?: string;
	onSortChange: (field: string) => void;
};

export default function EmailTable({
	emails = [],
	loading,
	onUpdate,
	allIds,
	selectedIds,
	setSelectedIds,
	toggleSelectAll,
	sortBy,
	sortDir,
	onSortChange,
}: EmailTableProps) {
	const allSelected = allIds.length > 0 && selectedIds.length === allIds.length;

	const toggleRow = (id: string) => {
		setSelectedIds((curr) =>
			curr.includes(id) ? curr.filter((currId) => currId !== id) : [...curr, id]
		);
	};

	const bulkUpdate = (
		payload: Partial<Pick<Email, "isFavorite" | "isRead">>
	) => {
		selectedIds.forEach((id) => onUpdate({ id, payload }));
		setSelectedIds([]);
	};

	const skeletonRows = Array.from({ length: 25 });

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>
						<div className="flex items-center gap-2">
							<Checkbox
								checked={allSelected}
								onCheckedChange={toggleSelectAll}
								aria-label="Select all rows"
							/>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon">
										<Ellipsis />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="w-48">
									<DropdownMenuItem
										onClick={() => bulkUpdate({ isFavorite: true })}
									>
										Favorite selected
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => bulkUpdate({ isRead: true })}
									>
										Mark as read
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</TableHead>
					{[
						{ label: "From", field: "sender" },
						{ label: "Subject", field: "subject" },
						{ label: "Date", field: "date" },
					].map(({ label, field }) => {
						const active = sortBy === field;
						const dirIcon = !active ? null : sortDir === "asc" ? (
							<ArrowUp className="ml-1 h-3 w-3" />
						) : (
							<ArrowDown className="ml-1 h-3 w-3" />
						);

						return (
							<TableHead key={field}>
								<button
									className="flex items-center"
									onClick={() => onSortChange(field)}
								>
									{label}
									{dirIcon}
								</button>
							</TableHead>
						);
					})}
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{loading ? (
					skeletonRows.map((_, idx) => (
						<TableRow key={idx}>
							{Array.from({ length: 5 }).map((__, i) => (
								<TableCell key={i} className="py-3">
									<div className="h-6 w-full animate-pulse rounded bg-muted" />
								</TableCell>
							))}
						</TableRow>
					))
				) : emails.length === 0 ? (
					<TableRow>
						<TableCell colSpan={5} className="text-center py-8">
							No results
						</TableCell>
					</TableRow>
				) : (
					emails.map(({ id, sender, subject, date, isFavorite, isRead }) => {
						const isSelected = selectedIds.includes(id);
						return (
							<TableRow
								key={id}
								className={isSelected ? "bg-blue-300" : undefined}
							>
								<TableCell>
									<Checkbox
										checked={isSelected}
										onCheckedChange={() => toggleRow(id)}
										aria-label="Select row"
									/>
								</TableCell>
								<TableCell>{sender}</TableCell>
								<TableCell>{subject}</TableCell>
								<TableCell>{formatDate(date)}</TableCell>
								<TableCell>
									<div className="flex gap-2">
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													aria-label={isFavorite ? "Unfavorite" : "Favorite"}
													onClick={() =>
														onUpdate({
															id,
															payload: { isFavorite: !isFavorite },
														})
													}
												>
													{isFavorite ? (
														<Star className="fill-amber-200" />
													) : (
														<StarOff />
													)}
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												{isFavorite ? "Unfavorite" : "Favorite"}
											</TooltipContent>
										</Tooltip>
										<Tooltip>
											<TooltipTrigger>
												<Button
													variant="ghost"
													size="icon"
													aria-label={
														isRead ? "Mark as unread" : "Mark as read"
													}
													onClick={() =>
														onUpdate({ id, payload: { isRead: !isRead } })
													}
												>
													{isRead ? <MailOpen /> : <Mail />}
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												{isRead ? "Mark as unread" : "Mark as read"}
											</TooltipContent>
										</Tooltip>
									</div>
								</TableCell>
							</TableRow>
						);
					})
				)}
			</TableBody>
		</Table>
	);
}
