export function fetchPopularRepos(lang) {
	const endpoint = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language: ${lang}&sort=stars&order=desc&type=Repositories`)
	return fetch(endpoint)
		.then((res) => res.json())
		.then((data) => {
			if (!data.items){
				throw new Error(data.massage)
			}
			return data.items
		});
}
