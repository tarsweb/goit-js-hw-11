import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import InfiniteScroll from 'infinite-scroll';
import markUpGaleryItems from '../templates/photo-card.hbs';

import './components/header-scroll';

const refs = {
  formQuery : document.querySelector("#search-form"),
  gallery : document.querySelector(".gallery"),
}

let currentSearchQuery = '';

const API_URL = 'https://pixabay.com/api/';
const API_KEY = '29897427-8c43c55c4e61f0db226418cba';

const searchParams = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'safesearch',
  per_page: 40,
});

const gallery = new SimpleLightbox('.gallery .photo-card.gallery__item', {
   captionsData: 'alt',
   captionDelay: 500,
   captionPosition: 'outside',
});

const infiniteScroll = new InfiniteScroll(refs.gallery, {
  responseBody: 'json',
  history: false,
  path () { return `${API_URL}?key=${API_KEY}&q=${currentSearchQuery}&page=${this.pageIndex}&${searchParams}`},
  status: '.page-load-status',
  }
);

// function updateURL() {
//   const API_URL = 'https://pixabay.com/api/';
//   const API_KEY = '29897427-8c43c55c4e61f0db226418cba';
  
//   const searchParams = new URLSearchParams({
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: 'safesearch',
//     per_page: 40,
//   });

//   currentSearchQuery = `${API_URL}?key=${API_KEY}&q=${currentSearchQuery}&page=${this.pageIndex}&${searchParams}`
// }

infiniteScroll.on('request', async (path, fetchPromise) => {
  // console.log(path);
  const response = await fetchPromise;
  if (response.ok) {
    return await response.json();
  }
});

infiniteScroll.on( 'error', function( error, path, response ) {
  // console.log(path);
  // console.log(error);
  Notify.failure(error.message)
})

infiniteScroll.on('load', ({totalHits, hits:images}) => {
  
  if (!images.length) {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    return
  }

  if (infiniteScroll.pageIndex -1 === 1) {
    Notify.info(`Hooray! We found ${totalHits} images.`);
  }
  appendMarkUpImages(images);
  gallery.refresh();

  if (refs.gallery.childElementCount >= totalHits) {
    Notify.warning("We're sorry, but you've reached the end of search results.");
    infiniteScroll.option({
      loadOnScroll: false,
    });
  }

  infiniteScroll.appendItems(refs.gallery.childNodes);
});

refs.formQuery.addEventListener('submit', (event) => {

  event.preventDefault();

  clearImages();

  currentSearchQuery = event.currentTarget.elements.searchQuery.value;  

  infiniteScroll.pageIndex = 1;
  infiniteScroll.option({
    loadOnScroll: true,
  //   path () { return `${API_URL}?key=${API_KEY}&q=${query}&page=${this.pageIndex}&${searchParams}`}
  });
  infiniteScroll.loadNextPage();

});

function appendMarkUpImages (images) {
  refs.gallery.insertAdjacentHTML('beforeend', markUpGaleryItems(images));
}

function clearImages() {
  refs.gallery.innerHTML = "";
}