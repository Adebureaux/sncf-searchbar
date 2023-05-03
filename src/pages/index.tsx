import SearchBar from './SearchBar'

export default function Home() {
	const handleSearch = (query: string) => {
		console.log(`user input "${query}"`);
	};

	return (
		<main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
			<SearchBar onSearch={handleSearch}/>
		</main>
	);
}
