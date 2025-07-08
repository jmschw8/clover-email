import { fetchEmails, saveFlaggedEmails } from "@/api/emails";
import type { Email } from "@/types/emailTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const useEmails = () => {
	return useQuery<Email[]>({
		queryKey: ["emails"],
		queryFn: () => fetchEmails(),
	});
};

type EmailUpdatePayload = Partial<Pick<Email, "isFavorite" | "isRead">>;

export const useUpdateEmailFlags = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: EmailUpdatePayload;
		}) => {
			// Since we don't actuially have a server, just stubbing out the mutation. Will 'set' the data in onMutate
			console.log(id, payload);
			return new Promise((r) => setTimeout(r, 120));
		},
		onMutate: async ({ id, payload }) => {
			// Optimistic update to mock out setting favorite/isread
			await queryClient.cancelQueries({ queryKey: ["emails"] });

			const prev = queryClient.getQueriesData({
				queryKey: ["emails"],
			});

			queryClient.setQueriesData<Email[]>({ queryKey: ["emails"] }, (old) =>
				old?.map((e) => (e.id === id ? { ...e, ...payload } : e))
			);

			saveFlaggedEmails(id, payload);

			return { prev };
		},
		onError: (_err, _vars, ctx) => {
			ctx?.prev.forEach(([key, data]) => queryClient.setQueryData(key, data));
		},
	});
};
