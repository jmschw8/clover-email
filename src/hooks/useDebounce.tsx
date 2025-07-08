import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, ms = 300): T {
	const [debounce, setDebounce] = useState(value);
	useEffect(() => {
		const id = setTimeout(() => setDebounce(value), ms);
		return () => clearTimeout(id);
	}, [value, ms]);
	return debounce;
}
