import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import type { EmailQueryParams } from "@/types/emailTypes";
import DatePicker from "@/components/global/DatePicker";
import { SlidersHorizontal, X } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

const filtersSchema = z.object({
	search: z.string().optional(),
	sender: z.string().optional(),
	subject: z.string().optional(),
	date: z
		.object({
			from: z.date(),
			to: z.date(),
		})
		.optional(),
	isFavorite: z.boolean().optional(),
});

type FilterFormValues = z.infer<typeof filtersSchema>;

type FiltersProps = {
	params: EmailQueryParams;
	setParams: React.Dispatch<React.SetStateAction<EmailQueryParams>>;
};

const Filters = ({ params, setParams }: FiltersProps) => {
	const [advancedSearch, setAdvancedSearch] = useState(false);
	const form = useForm<FilterFormValues>({
		resolver: zodResolver(filtersSchema),
		defaultValues: {
			search: params.search ?? "",
			sender: params.sender ?? "",
			subject: params.subject ?? "",
			date: params.date ?? undefined,
			isFavorite: params.isFavorite ?? undefined,
		},
	});

	const raw = useWatch({
		control: form.control,
		name: ["search", "sender", "subject", "date", "isFavorite"],
	});

	const watched = useMemo(
		() => ({
			search: raw[0],
			sender: raw[1],
			subject: raw[2],
			date: raw[3],
			isFavorite: raw[4] ?? undefined,
		}),
		[raw]
	);
	const debounced = useDebounce(watched, 300);
	useEffect(() => {
		setParams((prev) => ({
			...prev,
			...debounced,
			page: 1,
		}));
	}, [debounced, setParams]);

	const reset = () => {
		form.reset({
			search: "",
			sender: "",
			subject: "",
			date: undefined,
			isFavorite: undefined,
		});
	};

	return (
		<Form {...form}>
			<form className=" ">
				<div className="flex w-full items-center gap-4">
					<FormField
						control={form.control}
						name="search"
						render={({ field }) => (
							<FormItem className="flex flex-col w-full ">
								<FormLabel>Global Search</FormLabel>
								<FormControl>
									<Input
										className="w-full"
										placeholder="Search by subject, sender, body..."
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								onClick={() => setAdvancedSearch(!advancedSearch)}
							>
								<SlidersHorizontal />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Advanced Search</TooltipContent>
					</Tooltip>
				</div>

				{advancedSearch && (
					<div className="grid sm:grid-cols-2 lg:grid-cols-5 py-4 gap-4">
						<FormField
							control={form.control}
							name="sender"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sender</FormLabel>
									<FormControl>
										<Input placeholder="john@example.com" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="subject"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Subject</FormLabel>
									<FormControl>
										<Input placeholder="Subject contains…" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isFavorite"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Show Favorites</FormLabel>
									<FormControl>
										<Checkbox
											checked={field.value ?? false}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<Controller
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Date range</FormLabel>
									<FormControl>
										<DatePicker date={field.value} setDate={field.onChange} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-end">
							<Button
								className="w-32"
								variant="destructive"
								type="button"
								onClick={reset}
							>
								<X />
								Clear
							</Button>
						</div>
					</div>
				)}
			</form>
		</Form>
	);
};

export default Filters;
// grid sm:grid-cols-2 md:grid-cols-4 gap-4
