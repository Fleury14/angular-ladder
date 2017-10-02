// SHOW-HIDE NEWS SECTION

// show news button
const showNewsBtn = document.getElementById('showNewsButton');
const olderNews = document.querySelector('.hidden-news');
let newsHidden = true; //flag to denote if older news is hidden or not

function toggleNews() { //function to toggle older news showing
  if(newsHidden === true) {
    olderNews.style.height = '100%';
    showNewsBtn.innerText = 'Hide Older News';
    newsHidden=false;
  } else {
    olderNews.style.height='0px';
    showNewsBtn.innerText = 'Show Older News';
    newsHidden=true;
  }
}

showNewsBtn.addEventListener('click', toggleNews);