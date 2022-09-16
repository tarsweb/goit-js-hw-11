import ImagesApi from './feachImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import markUpGaleryItems from '../templates/photo-card.hbs';

import './components/header-scroll';
import ButtonLoadMore from './components/button-load-more';

const refs = {
  formQuery : document.querySelector("#search-form"),
  gallery : document.querySelector(".gallery"),
}

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

  clearImages();

  if (!imagesApi.query) {
    // console.log("Пустой запрос");
    Notify.warning("Sorry, but you have entered an empty query.")
    return;
  }

  fetchImages();

});

// buttonLoadMore.refs.button.addEventListener('click', fetchImages);
buttonLoadMore.refs.button.addEventListener('click', () => {

    imagesApi.nextPage();

    fetchImages();

});

//then.catch
// function fetchImages () {
  
//   imagesApi.fetchImages().then(({totalHits, hits:images}) => {

//     buttonLoadMore.disable();
   
//     if (!images.length) {
//       Notify.failure("Sorry, there are no images matching your search query. Please try again.");
//       buttonLoadMore.hide();
//       return
//     }

//     const currentPage = imagesApi.page;
//     if (currentPage === 1) {
//       Notify.info(`Hooray! We found ${totalHits} images.`);
//     }
//     appendMarkUpImages(images);
//     gallery.refresh();

//     if (currentPage != 1) {
//       smoothScroll();
//     }

//     // if (gallery.elements.length >= totalHits) {
//     if (refs.gallery.childElementCount >= totalHits) {
//       Notify.warning("We're sorry, but you've reached the end of search results.");
//       buttonLoadMore.hide();
//     } 
//     else {
//       buttonLoadMore.show();
//       buttonLoadMore.enable();
//     }
//   })
//   .catch( error => {
//     Notify.failure(error.message);
//     buttonLoadMore.hide();
//   })
// }

// async
async function fetchImages () {
  
  try {

    const {totalHits, hits:images} = await imagesApi.fetchImages();

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

    if (refs.gallery.childElementCount >= totalHits) {
      Notify.warning("We're sorry, but you've reached the end of search results.");
      buttonLoadMore.hide();
    } 
    else {
      buttonLoadMore.show();
      buttonLoadMore.enable();
    }
  }
  catch (error) {
    Notify.failure(error.message);
    buttonLoadMore.hide();
  }
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