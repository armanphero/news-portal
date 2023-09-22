const loadCatagories = () => {
    fetch(`https://openapi.programming-hero.com/api/news/categories`)
        .then(res => res.json())
        .then(data => showCatagories(data.data.news_category))
        .catch(error => console.log(error))
}

const showCatagories = (catagories) => {
    catagories.forEach(catagory => {
        // console.log(catagory);
        const { category_name, category_id } = catagory;
        document.getElementById('catagories-container').innerHTML += `
        <a href="#" class="catagory" onclick="loadAllNews('${category_id}','${category_name}')">${category_name}</a>
        `;
    })
}

let storedNews = [];
let catogoryName = '';
const loadAllNews = (category_id, category_name) => {
    fetch(`https://openapi.programming-hero.com/api/news/category/${category_id}`)
        .then(res => res.json())
        .then(data => {
            storedNews = data.data;
            catogoryName = category_name;
            showAllNews(data.data, category_name)
        })
        .catch(error => console.log(error))
}

const showAllNews = (news, category_name) => {
    const allNewsSection = document.getElementById('allNewsSection');
    allNewsSection.innerText = '';
    document.getElementById('number-of-news').innerText = news.length;
    document.getElementById('news-catagory').innerText = category_name;
    news.forEach(singleNews => {
        const { title, thumbnail_url, rating, total_view, details, author } = singleNews;
        // console.log(singleNews);
        allNewsSection.innerHTML += `
        <div class="cards row mb-3">
            <div class="cards-img col-2 text-center">
                <img src="${thumbnail_url}" alt="">
            </div>
            <div class="cards-body col-10 flex-column d-flex justify-content-between">
                <div>
                    <h2>${title}</h2>
                    <p>${details.slice(0, 200)}..</p>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center gap-2">
                        <img src="${author.img}" alt="" style="width: 40px; height: 40px;" class="rounded-circle">
                        <div>
                            <p class="m-0">${author.name}</p>
                            <p class="m-0">${author.published_date}</p>
                        </div>
                    </div>
                    <div>
                        <i class="fa-regular fa-eye"></i>
                        <span class="fw-bolder">${total_view ? total_view : 'no view'}</span>
                    </div>
                    <div>
                        ${showRatingNumber(rating.number)}
                        <p class="m-0 d-inline-block">${rating.number}</p>
                        ${rating.number > 4.5 ? '<p class="m-0 d-inline-block bg-warning fw-medium p-1 rounded">Excellent</p>' : ''}
                        
                    </div>
                    <div>
                        <a onclick="loadDetailForModal('${singleNews._id}')" href="#" class="fs-4" data-bs-target="#newsDetailsModal" data-bs-toggle="modal"><i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        </div>
        `
    })
}

const loadDetailForModal = (_id) => {
    fetch(`https://openapi.programming-hero.com/api/news/${_id}`)
        .then(res => res.json())
        .then(data => showDetailOnModal(data.data[0]))
        .catch(error => console.log(error))
}

const showDetailOnModal = (data) => {
    // console.log(data);
    const { title, image_url, rating, details, author, others_info } = data;
    document.getElementById('modal-body').innerHTML = `
    <div class="cards">
            <div class="cards-img text-center">
                <img src="${image_url}" alt="">
            </div>
            <div class="cards-body flex-column d-flex justify-content-between">
                <div>
                    <h2 class="fs-4">${title}</h2>
                    ${others_info.is_trending ? '<div class="text-end mb-2"><span class="bg-warning fw-medium p-1 rounded">Trending</span></div>' : ''}
                    
                    <p>${details}</p>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center gap-2">
                        <img src="${author.img}" alt="" style="width: 40px; height: 40px;" class="rounded-circle">
                        <div>
                            <p class="m-0">${author.name}</p>
                            <p class="m-0">${author.published_date}</p>
                        </div>
                    </div>
                    <div id="rating-div">
                        ${showRatingNumber(rating.number)}
                        <p class="m-0 d-inline-block">${rating.number}</p>
                    </div>
                </div>
            </div>
        </div> 
    `
}

const showTodaysPick = () => {
    const todaysPick = storedNews.filter(singleNews => singleNews.others_info.is_todays_pick === true);
    showAllNews(todaysPick, "Today's pick")
}

const showTrendingNews = () => {
    const trendingNews = storedNews.filter(singleNews => singleNews.others_info.is_trending === true);
    showAllNews(trendingNews, "Trending News")
}

const filterByView = () => {
    const selectBox = document.getElementById("selectBox");
    const selectedValue = selectBox.options[selectBox.selectedIndex].value;
    const selectedNews = storedNews.filter(singleNews => singleNews.total_view >= selectedValue);
    showAllNews(selectedNews, `over ${selectedValue} view`)
}

const showRatingNumber = (rating) => {
    let ratings = '';
    for (let i = 0; i < Math.floor(rating); i++) {
        ratings += `<i class="fa-solid fa-star"></i>`;
    }
    if (rating - Math.floor(rating) > 0) {
        ratings += `<i class="fa-solid fa-star-half"></i>`;
        return ratings;
    }
    // console.log(ratings);
    return ratings;

}