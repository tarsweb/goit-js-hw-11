// import { galleryItems } from './js/gallery-items';
import ImagesApi from './js/feachImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import markUpGaleryItems from './templates/photo-card.hbs';

import './js/components/header-scroll';
import ButtonLoadMore from './js/components/button-load-more';

// const stepPagination = 9;
// let counterPagination = 1;

const refs = {
  formQuery : document.querySelector("#search-form"),
  gallery : document.querySelector(".gallery"),
  // buttonLoadMore: document.querySelector(".load-more"),
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

const buttonLoadMore = new ButtonLoadMore({selector: ".load-more", hidden: true});

const gallery = new SimpleLightbox('.gallery .photo-card.gallery__item', {
   captionsData: 'alt',
   captionDelay: 500,
   captionPosition: 'outside',
});

const imagesApi = new ImagesApi();

refs.formQuery.addEventListener('submit', (event) => {

  event.preventDefault();
  
  imagesApi.query = event.currentTarget.elements.searchQuery.value;

  if (!imagesApi.query) {
    console.log("Пустой запрос");
  }

  clearImages();

  fetchImages();

});

// buttonLoadMore.refs.button.addEventListener('click', fetchImages);
buttonLoadMore.refs.button.addEventListener('click', () => {

    imagesApi.nextPage();

    fetchImages();

});

function fetchImages () {
  imagesApi.fetchImages().then(({totalHits, hits:images}) => {

    buttonLoadMore.disable();
   
    if (!images.length) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      buttonLoadMore.hide();
      return
    }

    const currentPage = imagesApi.page;
    if (currentPage === 1) {
      Notify.info(`Hooray! We found ${totalHits} images.`);
    }
    appendMarkUpImages(images);
    gallery.refresh();

    if (currentPage != 1) {
      smoothScroll();
    }

    // if (gallery.elements.length >= totalHits) {
    if (refs.gallery.childElementCount >= totalHits) {
      Notify.warning("We're sorry, but you've reached the end of search results.");
      buttonLoadMore.hide();
    } 
    else {
      buttonLoadMore.show();
      buttonLoadMore.enable();
    }
  })
  .catch( error => {
    Notify.failure(error.message);
    buttonLoadMore.hide();
  })
}

function appendMarkUpImages (images) {
  refs.gallery.insertAdjacentHTML('beforeend', markUpGaleryItems(images));
}

function clearImages() {
  refs.gallery.innerHTML = "";
}

function smoothScroll() {
  const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
}