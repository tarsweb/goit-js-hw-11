import { galleryItems } from './js/_gallery-items';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

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

const elementGallery = document.querySelector(".gallery");

const stringAppendElements = galleryItems.map(createMarkupElement).join("");

elementGallery.insertAdjacentHTML("afterbegin", stringAppendElements);

let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 500,
  captionPosition: 'outside',
});