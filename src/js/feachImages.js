import axios from "axios";
const API_URL = 'https://pixabay.com/api/';
const API_KEY = '29897427-8c43c55c4e61f0db226418cba';

const params = {
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'safesearch',
  per_page: 40,
};

axios.defaults.baseURL = API_URL;

class GalleryApiImages{

  #searchQuery;
  #currentPage;

  constructor() {
    this.#searchQuery = null;
    this.#currentPage = 1;
  }

  // USE axios
  async fetchImages() {
    const response = await axios.get('/', 
      {
        params: {
          key: API_KEY,
          q: this.#searchQuery,
          page: this.#currentPage,
          ...params,
        },
      }
    );
    return response.data;
  }

  // USE async 
  // async fetchImages() {
  //   const searchParams = new URLSearchParams(params);
  //   const response = await fetch(`${API_URL}?key=${API_KEY}&q=${this.#searchQuery}&page=${this.#currentPage}&${searchParams}`);
  //   if (response.ok) {
  //     return await response.json();
  //   }
  //   throw new Error(response.status);
  // }

  // USE then.catch
  // fetchImages() {
  //   const searchParams = new URLSearchParams(params);
  //   const response = fetch(`${API_URL}?key=${API_KEY}&q=${this.#searchQuery}&page=${this.#currentPage}&${searchParams}`);
  //   return response.then(response => {
  //     if (response.ok) {
  //       return response.json();
  //     }
  //     throw new Error(response.status);
  //   })
  // }
  getCurrentURL() {
    const searchParams = new URLSearchParams(params);
    return `${API_URL}?key=${API_KEY}&q=${this.#searchQuery}&page=${this.#currentPage}&${searchParams}`
  }


  get query() {
    return this.#searchQuery
  }
  set query(newSearhQuery) {
    // if (this.#searchQuery === newSearhQuery) {
    //  
    // }
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

export default GalleryApiImages;