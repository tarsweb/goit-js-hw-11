import { galleryItems } from './js/gallery-items';
import ImagesApi from './js/feachImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import markUpGaleryItems from './templates/photo-card.hbs';

// const stepPagination = 9;
// let counterPagination = 1;

const refs = {
  formQuery : document.querySelector("#search-form"),
  gallery : document.querySelector(".gallery"),
  buttonLoadMore: document.querySelector(".load-more"),
}
// const isLazyLoadImage = ('loading' in HTMLImageElement.prototype);
// console.log(isLazyLoadImage);
// if (isLazyLoadImage) {
//   //console.log('This browser support lazyload');
// }
// else{
//   //console.log('This browser unsupport lazyload');
//   import ("lazysizes");
// }
const isLazyLoadImage = true;

function createMarkupElement({preview, original,  description}) {
  return `<a class="gallery__item" href="${original}">
            <img loading="lazy" class="gallery__image ${isLazyLoadImage ? "" : "lazyload"}" 
              ${(isLazyLoadImage ? "src=" : "data-src=") + preview} 
              alt="${description}" 
              width=340
              hight=270
            />
          </a>`
}

// let stringAppendElements = markUpGaleryItems(galleryItems.slice(0,stepPagination));
// refs.gallery.insertAdjacentHTML("afterbegin", stringAppendElements);

const gallery = new SimpleLightbox('.gallery .photo-card.gallery__item', {
   captionsData: 'alt',
   captionDelay: 500,
   captionPosition: 'outside',
});

const imagesApi = new ImagesApi();

// document.addEventListener('DOMContentLoaded', () => {
//   refs.buttonLoadMore.classList.toggle("visually-hidden")
// });

updateLoadMoreUI();

refs.formQuery.addEventListener('submit', (event) => {

  event.preventDefault();
  
  imagesApi.query = event.currentTarget.elements.searchQuery.value;

  console.log(imagesApi.page);

  if (!imagesApi.query) {
    console.log("Пустой запрос");
  }

  clearImages();

  fetchImages();

});

refs.buttonLoadMore.addEventListener('click', () => {

  updateLoadMoreUI();

  imagesApi.nextPage();

  fetchImages();

});

function fetchImages () {
  imagesApi.fetchImages().then(({totalHits, hits:images}) => {
    
    if (!images.length) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      return
    }
    if (imagesApi.page === 1) {
      Notify.info(`Hooray! We found ${totalHits} images.`);
    }
    appendMarkUpImages(images);
    gallery.refresh();

    if (gallery.elements.length === totalHits) {
      Notify.warning("We're sorry, but you've reached the end of search results.");
    } 
    else {
      updateLoadMoreUI();
    }
  }) 
}

function appendMarkUpImages (images, totalHits) {
  refs.gallery.insertAdjacentHTML('beforeend', markUpGaleryItems(images));  
}

function clearImages() {
  refs.gallery.innerHTML = "";
}

function updateLoadMoreUI() {
  refs.buttonLoadMore.classList.toggle("visually-hidden");
}
