$(document).ready(function () {
  // get value from div
  let doctorId = $(".rate-doctor").data('did');

  // initialize rate
  let ratedFill = "#FFC107",
  normalFill = "#C4C4C4";
  $("#rateScore").text((0.0).toFixed(1));

  const $rateYo = $("#rateYo").rateYo({
    rating: 0.0,
    ratedFill: ratedFill,
    normalFill: normalFill,
  })
  .on("rateyo.change", function (e, data) {
    let rating = parseFloat(data.rating).toFixed(1);
    $("#rateScore").text(rating);
  });


  // get reviews by current doctor
  getReviews({ doctorId: doctorId });
  // // get average rate by current doctor
  getAverageRate({ doctorId: doctorId  });

  // post a review
  $("#postReview").on("click", function () {
    try {
      let userId = $(".rate-doctor").data('uid'),
        doctorId = $(".rate-doctor").data('did'),
        rating = $rateYo.rateYo("rating"),
        review = $("#reviewContext").val().trim().toString();

      let reviewObj = {
        doctor: doctorId,
        userId: userId,
        rating: rating,
        review: review,
      };
      let rateObj = {
        rating: rating,
        doctor: doctorId,
      };
      // if not user id or doctor return to login
      if ( !userId || !doctorId) {
        location.href = "/user/login";
      } else {
        addReview(reviewObj);
        addRate(rateObj);
      }
    } catch (err) {
      console.log(err);
    }
  });
  // initialize reply modal
  //$(".modal").modal();

  // search a review
  $(".search-btn").on("click", function () {
    try {
      let text = $(".search-input").val();
      let search = {
        doctorId: doctorId,
        text: text,
      };
      searchReviews(search);
    } catch (err) {
      console.log(err);
    }
  });
  // sorting
  $(".sorting-item").each(function (index) {
    let category = "";
    try {
      $(this).on("click", function () {
        // change class
        $(this).addClass("active").siblings().removeClass("active");
        // get sort category
        category = $(this).data("text");

        if (category == "newest") {
          // get reviews by current doctor (sort by date)
          getReviews({ doctorId: doctorId });
        } else if (category == "highest") {
          // show reviews (sort by highest rating)
          showReviewsSortByHeightScores();
        } else if (category == "lowest") {
          // show reviews (sort by lowest rating)
          showReviewsSortbyLowScores();
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
});


/**
 * add a review
 * @param data
 * qiaoli wang (wangqiao@deakin.edu.au)
 */
addReview = (data) => {
  try {
    console.log(data);
    fetch(`/review/addReview`, {
      method: 'POST', // or 'PUT'
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      })
     .then(response => response.json())
     .then(data => {
       let result = data;
       if(result.success){
         location.reload();
       }else {
       console.log(result);
     }
     })
     .catch((error) => {
        console.log('Error:', error);
     });
  } catch (err) {
    console.log(err);
  }
};
/**
 * get reviews by doctor (sort by date)
 * @param doctorId
 * qiaoli wang (wangqiao@deakin.edu.au)
 */
let reviews = [];
getReviews = (doctor) => {
  $(".review-list").empty();
  try {
    fetch(`/review/reviews?doctorId=${doctor.doctorId}`, {
      method: 'GET', // or 'PUT'
      headers: {
          'Content-Type': 'application/json',
      },
      })
      .then(response => response.json())
      .then(data => {
         reviews = data.data;
         renderReviews(reviews);
      })
      .catch((error) => {
      console.log('Error:', error);
      });    
  } catch (err) {
    console.log(err);
  }
};
showNewestReviews = () => {
  $(".review-list").empty();
  try {
    renderReviews(reviews);
  } catch (err) {
    console.log(err);
  }
};
showReviewsSortByHeightScores = () => {
  $(".review-list").empty();
  try {
    let result = reviews.sort(function (a, b) {
      return b.rating - a.rating;
    });
    renderReviews(result);
  } catch (err) {
    console.log(err);
  }
};
showReviewsSortbyLowScores = () => {
  $(".review-list").empty();
  try {
    let result = reviews.sort(function (a, b) {
      return a.rating - b.rating;
    });
    renderReviews(result);
  } catch (err) {
    console.log(err);
  }
};

// /**
//  * search reviews by review content
//  * @param search
//  * qiaoli wang (wangqiao@deakin.edu.au)
//  */
searchReviews = (search) => {
  $(".review-list").empty();
  try {
    fetch(`/review/reviewsSearch`, {
      method: 'POST', // or 'PUT'
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(search),
      })
      .then(response => response.json())
      .then(data => {
         renderReviews(data);
      })
      .catch((error) => {
      console.log('Error:', error);
      }); 
  } catch (err) {
    console.log(err);
  }
};
// /**
//  * render reviews to page
//  * @param data
//  * qiaoliwang (wangqiao@deakin.edu.au)
//  */
renderReviews = (data) => {
  let currentUserId = $(".rate-doctor").data('uid');
  try {
    if (data.length > 0) {
      showScorePercentage(data);
      data.forEach((item, index) => {
        // getReplies({ reviewId: item._id }, index);
        let reviewItem = `<div class="review-item">
                    <div class="review-top capitalize">
                        <span id="user-${index}" data-uid="${item.user[0]._id}">${
          item.user[0].name
        }</span>
                    </div>
                    <div class="display-flex-start mt-10">
                        <div class="rating-item"></div>
                        <div class="rating-score">${parseFloat(
                          item.rating
                        ).toFixed(1)}</div>
                        <div class="text-gray ml-10">${moment(
                          item.createTime
                        ).fromNow()}</div>
                    </div>
                    <div class="review-content mt-10">
                        ${item.review}
                    </div>
                    <div class="review-operation">
                        ${currentUserId === item.user[0]._id ? '' : `<span id="reply-${index}" class="text-gray" onclick="openReplyModal(${index})" data-user="${item.user[0].name}" data-id="${item._id}">Reply</span>`}
                        ${currentUserId === item.user[0]._id ? `<span id="delete-${index}" class="text-gray ml-20" onclick="DeleteModal(${index})" data-user="${item.user[0].name}" data-id="${item._id}" data-review="${item.review}">Delete</span>` : ""}
                    </div>
                    <div class="response-list response-${index}"></div>
                </div>`;
        $(".review-list").append(reviewItem);
        $(".rating-item").rateYo({
          ratedFill: "#FFC107",
          normalFill: "#C4C4C4",
          rating: item.rating,
          starWidth: "15px",
        });
        $(".rating-item").rateYo("option", "readOnly", true);
      });
    } else {
      $(".review-list").append(`<div class="no-data">no data</div>`);
    }
  } catch (err) {
    console.log(err);
  }
};
// /**
//  * give a rate
//  * @param data
//  * qiaoli wang (wangqiao@deakin.edu.au)
//  */
addRate = (data) => {
  try {
    console.log(data);
    fetch(`/review/addRate`, {
      method: 'POST', // or 'PUT'
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => {
        if(data.length >0){
          alert('Your appointment was canceled!!')
          location.reload();
        }
      })
      .catch((error) => {
      console.log('Error:', error);
      });
  } catch (err) {
    console.log(err);
  }
};
/**
 * get average rating score of current doctor
 * @param doctor
 * qiaoli wang (wangqiao@deakin.edu.au)
 */
getAverageRate = (doctor) => {
  try {
    fetch(`/review/averageRate?doctorId=${doctor.doctorId}`, {
      method: 'GET', // or 'PUT'
      headers: {
          'Content-Type': 'application/json',
      },
      })
      .then(response => response.json())
      .then(data => {
         $("#averageScore").rateYo({
          ratedFill: "#FFC107",
          normalFill: "#C4C4C4",
          rating: data.rating,
          starWidth: "15px",
        });
        $("#averageScore").rateYo("option", "readOnly", true);
        $("#averageScore-text").text(parseFloat(data.rating).toFixed(1));
      }).catch((error) => {
        console.log('Error:', error);
      }); 
  } catch (err) {
    console.log(err);
  }
};
// /**
//  * display percentage of each rating level
//  * @param data
//  * qiaoli wang (wangqiao@deakin.edu.au)
//  */
showScorePercentage = (data) => {
  try {
    let s5 = data.filter((item) => {
      return parseFloat(item.rating) == 5;
    });
    let s4 = data.filter((item) => {
      return parseFloat(item.rating) < 5 && parseFloat(item.rating) > 4;
    });
    let s3 = data.filter((item) => {
      return parseFloat(item.rating) < 4 && parseFloat(item.rating) > 3;
    });
    let s2 = data.filter((item) => {
      return parseFloat(item.rating) < 3 && parseFloat(item.rating) > 2;
    });
    let s1 = data.filter((item) => {
      return parseFloat(item.rating) < 2 && parseFloat(item.rating) > 1;
    });
    $(".star-5").attr("style", "width:" + s5.length + "%");
    $(".star-4").attr("style", "width:" + s4.length + "%");
    $(".star-3").attr("style", "width:" + s3.length + "%");
    $(".star-2").attr("style", "width:" + s2.length + "%");
    $(".star-1").attr("style", "width:" + s1.length + "%");

  } catch (err) {
    console.log(err);
  }
};
