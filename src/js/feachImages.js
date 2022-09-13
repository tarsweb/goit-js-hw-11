const API_URL = 'https://pixabay.com/api/';
const API_KEY = '29897427-8c43c55c4e61f0db226418cba';


const params = {image_type: "photo", orientation: "horizontal", safesearch: "safesearch", per_page : 40 };
const temp = new URLSearchParams(params);

class GalleryApiImages{

  #searchQuery;
  #currentPage;
  #maxCount;

  constructor() {
    this.#searchQuery = null;
    this.#currentPage = 1;
    this.#maxCount = null;
  }

  async fetchImages() {
    const response = await fetch(`${API_URL}?key=${API_KEY}&q=${this.#searchQuery}&page=${this.#currentPage}&${temp}`);
    if (!response.ok) {
      throw new Error(response.status)
    }
    return await response.json();
  }

  get query() {
    return this.#searchQuery
  }
  set query(newSearhQuery) {
    if (this.#searchQuery === newSearhQuery) {
      return
    }
    this.#searchQuery = newSearhQuery;
    this.#currentPage = 1;
  }

  get page() {
    return this.#currentPage
  }

  set page(newPage) {
    this.#currentPage = newPage;
  }

  nextPage() {
    this.#currentPage += 1;
  }

  previousPage() {
    if (!(this.#currentPage - 1)){
      return
    }
    
    this.#currentPage -= 1;
  }
}

// async function fetchImages (querySelector) {

//   const response = await fetch(`${API_URL}`);
//   if (!response.ok) {
//     throw new Error(response.status)
//   }
//   return await response.json();
// }

export default GalleryApiImages;