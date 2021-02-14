const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const error = document.getElementById('error');
const matchingResult= document.getElementById('matchingResult');
let sliders = [];
//
// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  document.getElementById('matchingResultContainer').style.display = 'block';
  matchingResult.innerText = images.length;
  if (images.length === null || images.length== "") {
    error.style.display = 'block';
    imagesArea.style.display = 'none';
  }
  else {
    error.style.display = 'none';
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = ` <img class="img-fluid img-thumbnail w-100 " onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div)
    })
  }

}

const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(() => {
      document.getElementById('serverError').style.display = 'block';
      error.style.display = 'none';
      imagesArea.style.display = 'none';
  });
}

let slideIndex = 0;
let count = 0;
const selectItem = (event, img) => {
  let element = event.target;
  // element.classList.add('added');
  let item = sliders.indexOf(img);
  if (item === -1) {
    element.classList.add('added');
    sliders.push(img);
    count ++;
    document.getElementById('selectedImg').innerText = count;
  } else {
    element.classList.remove('added');
    sliders.splice(item, 1);
    if (count >0) {
      count --;
      document.getElementById('selectedImg').innerText = count;
    }
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;
  sliderContainer.appendChild(prevNext)
  // check negative duration for slide
  if (document.getElementById('duration').value < 0) {
    alert('Slider duration cant be negative');
    return;
  }
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  const duration = document.getElementById('duration').value || 1000;
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<h4>Slide duration is: ${duration}ms</h4><img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}
const clearDuration = () =>{
  document.getElementById('duration').value = '';
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}
searchBtn.addEventListener('click', function () {
  keyPress();
})
sliderBtn.addEventListener('click', function () {
  createSlider()
})
const keyPress = () => {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
  count = 0;
  document.getElementById('selectedImg').innerText = count;
}
const enterBtn = (event) => {
  if (event.key == 'Enter') {
    keyPress();
  }
}
const enterBtn2 = (event) => {
  if (event.key == 'Enter' || e == 0) {
    createSlider();
  }
}