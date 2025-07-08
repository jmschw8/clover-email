import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from "../ui/pagination";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type PaginationControlsProps = {
	currentPage: number;
	totalPages: number;
	handlePageChange: (page: number) => void;
};

// TODO clean this up
const getDisplayedPages = (totalPages: number, currentPage: number) => {
	if (totalPages < 4) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}
	if (totalPages >= 4) {
		if (currentPage <= 1) {
			return [1, 2, 3];
		} else if (currentPage < totalPages - 1) {
			return [currentPage - 1, currentPage, currentPage + 1];
		} else {
			return [totalPages - 2, totalPages - 1, totalPages];
		}
	}
};

const PaginationControls = ({
	currentPage,
	totalPages,
	handlePageChange,
}: PaginationControlsProps) => {
	const pages = getDisplayedPages(totalPages, currentPage);
	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<Button
						variant="outline"
						disabled={currentPage <= 1}
						onClick={() => handlePageChange(currentPage - 1)}
					>
						<ChevronLeftIcon />
						<span className="hidden sm:block">Previous</span>
					</Button>
				</PaginationItem>
				{pages?.map((page) => (
					<PaginationItem key={page}>
						<Button
							size="sm"
							variant="outline"
							disabled={page === currentPage}
							onClick={() => handlePageChange(page)}
						>
							{page}
						</Button>
					</PaginationItem>
				))}
				<PaginationItem>
					<Button
						variant="outline"
						disabled={currentPage === totalPages}
						onClick={() => handlePageChange(currentPage + 1)}
					>
						<span className="hidden sm:block">Next</span>
						<ChevronRightIcon />
					</Button>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};

export default PaginationControls;
