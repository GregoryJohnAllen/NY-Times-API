//The baseURL is our endpoint. An endpoint is when we fetch data from an API, we are making a request for some kind of data to a specific point (endpoint). We are going to use our baseURL and add our query string to it so that it can access the proper date
const baseURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
const key = "AKwGikPcXzByJzHVgY0OebGhkSO8S5tL";
let url;
//This url above will be used later on in the code to make a dynamic search URL

//SEARCH FORM
//querySelector() method will return the first Element within the document that matches the specified selector or group of selctors. If no matches are found, null is returned instead
const searchTerm = document.querySelector(".search");
const startDate = document.querySelector(".start-date");
const endDate = document.querySelector(".end-date");
const searchForm = document.querySelector("form");
const submitButton = document.querySelector(".submit");

//RESULTS NAVIGATION
const nextBtn = document.querySelector(".next");
const previousBtn = document.querySelector(".prev");
const nav = document.querySelector("nav");

//RESULTS SECTION
const section = document.querySelector("section");

nav.style.display = "none";

//the below code ensures that the nav won't be visible until we want it to be
let pageNumber = 0;
console.log('PageNumber:', pageNumber);
let displayNav = false;

searchForm.addEventListener("submit", fetchResults);
nextBtn.addEventListener("click", nextPage);
previousBtn.addEventListener("click", previousPage);

//The little 'e' in the below code is called an 'event handling function' every event handling function receives an event object. The 'e' allows you to interact with the object.
function fetchResults(e) {
  e.preventDefault(); //We put in a preventDefault to make sure that a request isn't actually sent. the default nature of a form element is to submit data, to send a POST request. We are instead going to to be using the form to construct our GET request

  url =
    baseURL +
    "?api-key=" +
    key +
    "&page=" +
    pageNumber +
    "&q=" +
    searchTerm.value;
    console.log("URL:", url);

  //CONDITIONAL STATMENTS FOR END DATE AND START DATE using rudimentary 'form validation'
  // if (startDate.value !== '') {
  //   // the !== means that if the input fields for dates aren't blank the date values will be added to the URL string
  //   url += '&begin_date=' + startDate.value;
  // }
  // if (endDate.value !== '') {
  //   // the !== means that if the input fields for dates aren't blank the date values will be added to the URL string
  //   url += '&end_date=' + endDate.value;
  // };

  fetch(url) //FETCH request and then pass in the NYT url
    .then(function(result) {
      //creating a promise .then which will return a response that we call result
      return result.json(); //converting the result into a useable json format with result.json()
    })
    .then(function(json) {
      //creating a second promise .then that takes in the useable json object
      displayResults(json);
      //When the Promise reurns the json, we fire off displayResults() that will work to manage the data
    });
}

function displayResults(json) {
    //this while loop will ensure that when you search a new topic it will not append those results to the already lsited results
  while(section.firstChild) { 
    section.removeChild(section.firstChild);
  }

  let articles = json.response.docs;

  if(articles.length >= 10) {
    //we are targeting the nav element created in the nav variable we made at the top of the page, which in turn tagets the HTML
    nav.style.display = 'block'; //shows the nav display if 10 items are in the array
  }else {
    nav.style.display = 'none'; //hides the nav display if less than 10 items are in the array
  }

  if (articles.length === 0) {
    console.log("No resuslts"); //Using this console log allows us to handle the logic of having no result, we will fix this later but it keeps the momentum of coding going forward
  } else {
    for (let i = 0; i < articles.length; i++) {
      let article = document.createElement('article'); //creating a node in the DOM for article
      let heading = document.createElement('h2'); //creating a node in the DOM for h2
      let link = document.createElement('a'); //creating an 'a' element which will be the anchor tag that will allow a 'href'
      let img = document.createElement('img'); // creating an img variable to create a 'img' element
      let para = document.createElement('p'); //creating a p tag to the DOM to append later
      let clearfix = document.createElement('div'); //creating a clearfix variable that later on will append to the DOM NEW

      let current = articles[i]; //this will hold the data of the current article as we iterate
      console.log("Current:", current); //log the data so we can see it as it is iterating

      link.href = current.web_url; //because link is an anchor we need to attach an href property. current.web_url automatically grabs the hyperlink for the current article out of the json result
      link.textContent = current.headline.main; //current.headline.main is part of the json object 

      para.textContent = 'Keywords: '; //textContent attribute is added so that each result will show this at the start of the p tag that is created by para

      for(let j = 0; j < current.keywords.length; j++) { //the nested for loop is used to iterate over the current object, primarily for keywords which is an array
        let span = document.createElement('span'); // we create span for each keyword as we iterate, span is an element that will end when the item ends. <span> of Pizza = start at P and end at a.
        span.textContent += current.keywords[j].value + ' '; // the textContent of the span is the value found inside of each keywords array
        para.appendChild(span); //append the span to each para node
      }

      if(current.multimedia.length > 0) { //there is a multimedia property in json that allows us to check for any images in the conditonal
        img.src = 'http://www.nytimes.com/' + current.multimedia[0].url;
        img.alt = current.headline.main; //if no image is available this sets the alt the value of the headline
        //the above code is basically this <img src="www.myimage.com/5478457" alt="My Image"
      }

      clearfix.setAttribute('class', 'clearfix'); //the outer loop will be printing the results, setAttribute is a CSS class

      article.appendChild(heading); //creating a child node, a new h2 element will be created inside each article element
      heading.appendChild(link); //this appends a link as a child element in the DOM within each of the h2
      article.appendChild(img);
      article.appendChild(para); //appended as children to the article
      article.appendChild(clearfix); //appended as children to the article
      section.appendChild(article); //we pass in article to section (already in html), article is a child of section, and h2 is a grandchild of section
    }
  }
};

function nextPage(e) {
  pageNumber++;
  fetchResults(e);
  console.log("Page number:", pageNumber);
}

function previousPage(e) {
  if(pageNumber > 0) {
    pageNumber--;
  } else {
    return;
  }
  fetchResults(e);
  console.log("Page:", pageNumber);
}
