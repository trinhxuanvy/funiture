(function ($) {
  "use strict";

  $(function () {
    $(".datetimepicker").datepicker();
  });

  $(".popup-youtube, .popup-vimeo").magnificPopup({
    // disableOn: 700,
    type: "iframe",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
  });

  var review = $(".textimonial_iner");
  if (review.length) {
    review.owlCarousel({
      items: 1,
      loop: true,
      dots: true,
      autoplay: true,
      autoplayHoverPause: true,
      autoplayTimeout: 5000,
      nav: false,
      responsive: {
        0: {
          margin: 15,
        },
        600: {
          margin: 10,
        },
        1000: {
          margin: 10,
        },
      },
    });
  }
  var best_product_slider = $(".best_product_slider");
  if (best_product_slider.length) {
    best_product_slider.owlCarousel({
      items: 4,
      loop: true,
      dots: false,
      autoplay: true,
      autoplayHoverPause: true,
      autoplayTimeout: 5000,
      nav: true,
      navText: ["next", "previous"],
      responsive: {
        0: {
          margin: 15,
          items: 1,
          nav: false,
        },
        576: {
          margin: 15,
          items: 2,
          nav: false,
        },
        768: {
          margin: 30,
          items: 3,
          nav: true,
        },
        991: {
          margin: 30,
          items: 4,
          nav: true,
        },
      },
    });
  }

  //product list slider
  var product_list_slider = $(".product_list_slider");
  if (product_list_slider.length) {
    product_list_slider.owlCarousel({
      items: 1,
      loop: true,
      dots: false,
      autoplay: true,
      autoplayHoverPause: true,
      autoplayTimeout: 5000,
      nav: true,
      navText: ["next", "previous"],
      smartSpeed: 1000,
      responsive: {
        0: {
          margin: 15,
          nav: false,
          items: 1,
        },
        600: {
          margin: 15,
          items: 1,
          nav: false,
        },
        768: {
          margin: 30,
          nav: true,
          items: 1,
        },
      },
    });
  }

  //single banner slider
  // var banner_slider = $('.banner_slider');
  // if (banner_slider.length) {
  //   banner_slider.owlCarousel({
  //     items: 1,
  //     loop: true,
  //     dots: false,
  //     autoplay: true,
  //     autoplayHoverPause: true,
  //     autoplayTimeout: 5000,
  //     nav: true,
  //     navText: ["next","previous"],
  //     smartSpeed: 1000,
  //   });
  // }

  if ($(".img-gal").length > 0) {
    $(".img-gal").magnificPopup({
      type: "image",
      gallery: {
        enabled: true,
      },
    });
  }

  //single banner slider
  $(".banner_slider")
    .on("initialized.owl.carousel changed.owl.carousel", function (e) {
      function pad2(number) {
        return (number < 10 ? "0" : "") + number;
      }
      var carousel = e.relatedTarget;
      $(".slider-counter").text(pad2(carousel.current()));
    })
    .owlCarousel({
      items: 1,
      loop: true,
      dots: false,
      autoplay: true,
      autoplayHoverPause: true,
      autoplayTimeout: 5000,
      nav: true,
      navText: ["next", "previous"],
      smartSpeed: 1000,
      responsive: {
        0: {
          nav: false,
        },
        600: {
          nav: false,
        },
        768: {
          nav: true,
        },
      },
    });

  // niceSelect js code
  // $(document).ready(function () {
  //   $("select").niceSelect();
  // });

  // menu fixed js code
  // $(window).scroll(function () {
  //   var window_top = $(window).scrollTop() + 1;
  //   if (window_top > 50) {
  //     $('.main_menu').addClass('menu_fixed animated fadeInDown');
  //   } else {
  //     $('.main_menu').removeClass('menu_fixed animated fadeInDown');
  //   }
  // });

  $(".counter").counterUp({
    time: 2000,
  });

  $(".slider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    speed: 300,
    infinite: true,
    asNavFor: ".slider-nav-thumbnails",
    autoplay: true,
    pauseOnFocus: true,
    dots: true,
  });

  $(".slider-nav-thumbnails").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: ".slider",
    focusOnSelect: true,
    infinite: true,
    prevArrow: false,
    nextArrow: false,
    centerMode: true,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          centerMode: false,
        },
      },
    ],
  });

  // Search Toggle
  $("#search_input_box").hide();
  $("#search_1").on("click", function () {
    $("#search_input_box").slideToggle();
    $("#search_input").focus();
  });
  $("#close_search").on("click", function () {
    $("#search_input_box").slideUp(500);
  });

  //------- Mailchimp js --------//
  function mailChimp() {
    $("#mc_embed_signup").find("form").ajaxChimp();
  }
  mailChimp();

  //------- makeTimer js --------//
  function makeTimer() {
    //		var endTime = new Date("29 April 2018 9:56:00 GMT+01:00");
    var endTime = new Date("27 Sep 2019 12:56:00 GMT+01:00");
    endTime = Date.parse(endTime) / 1000;

    var now = new Date();
    now = Date.parse(now) / 1000;

    var timeLeft = endTime - now;

    var days = Math.floor(timeLeft / 86400);
    var hours = Math.floor((timeLeft - days * 86400) / 3600);
    var minutes = Math.floor((timeLeft - days * 86400 - hours * 3600) / 60);
    var seconds = Math.floor(
      timeLeft - days * 86400 - hours * 3600 - minutes * 60
    );

    if (hours < "10") {
      hours = "0" + hours;
    }
    if (minutes < "10") {
      minutes = "0" + minutes;
    }
    if (seconds < "10") {
      seconds = "0" + seconds;
    }

    $("#days").html("<span>Days</span>" + days);
    $("#hours").html("<span>Hours</span>" + hours);
    $("#minutes").html("<span>Minutes</span>" + minutes);
    $("#seconds").html("<span>Seconds</span>" + seconds);
  }
  // click counter js
  (function () {
    window.inputNumber = function (el) {
      var min = el.attr("min") || false;
      var max = el.attr("max") || false;

      var els = {};

      els.dec = el.prev();
      els.inc = el.next();

      el.each(function () {
        init($(this));
      });

      function init(el) {
        els.dec.on("click", decrement);
        els.inc.on("click", increment);

        function decrement() {
          var value = el[0].value;
          value--;
          if (!min || value >= min) {
            el[0].value = value;
          }
        }

        function increment() {
          var value = el[0].value;
          value++;
          if (!max || value <= max) {
            el[0].value = value++;
          }
        }
      }
    };
  })();

  inputNumber($(".input-number"));

  setInterval(function () {
    makeTimer();
  }, 1000);

  // click counter js

  // var a = 0;
  // $('.increase').on('click', function(){

  //   console.log(  $(this).innerHTML='Product Count: '+ a++ );
  // });

  var product_overview = $("#vertical");
  if (product_overview.length) {
    product_overview.lightSlider({
      gallery: true,
      item: 1,
      vertical: true,
      verticalHeight: 450,
      thumbItem: 3,
      slideMargin: 0,
      speed: 600,
      autoplay: true,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            item: 1,
          },
        },
        {
          breakpoint: 576,
          settings: {
            item: 1,
            slideMove: 1,
            verticalHeight: 350,
          },
        },
      ],
    });
  }

  // handle fix money
  $(function () {
    const money = $(".money");

    for (let i = 0; i < money.length; i++) {
      money[i].innerHTML = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(money[i].innerHTML);
    }
  });

  function convertMoney(money) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(money);
  }
  

  jQuery.validator.addMethod('valid_phone', function (value) {
    var regex = /^[0-9]*$/gm;
    return value.trim().match(regex);
  });

  jQuery.validator.addMethod('valid_username', function (value) {
    const url = new URL(window.location.href);
    const txtUsername = $("#username_signup")
        var data = $.ajax({
          method: "get",
          contentType: "application/json",
          async: false,
          url:
            url.origin +
            url.pathname +
            "/" +
            $(txtUsername[0]).val() +
            url.search,
          dataType: "json",
          success: function (response) {
            return response;
          },
        });
    return !data.responseJSON;
  });

  // Xử lý valide form submit
  $(function () {
    const btnSubmit = $("#btnSubmit");
    $(btnSubmit[0]).click(function (e) {
      e.preventDefault();
      // console.log("oke");
      $("#formSubmit").validate({
        rules: {
          email: {
            required: true,
            email: true,
          },
          phone: {
            valid_phone: true,
            minlength: 10,
            maxlength: 10,
          },
          username: {
            valid_username: true,
          },
          province: {
            required: true
          },
          district: {
            required: true
          },
          commune: {
            required: true
          },
          address: {
            required: true
          },
          password: {
            required: true,
            minlength: 8,
          },
          confirmPassword: {
            required: true,
            minlength: 8,
            equalTo: "#password",
          },
          newPassword: {
            required: true,
            minlength: 8,
          },
          reNewPassword: {
            required: true,
            minlength: 8,
            equalTo: "#newPassword",
          },
        },
        messages: {
          email: {
            required: "Please enter email",
          },
          username: {
            required: "Please enter username",
            valid_username: "Username already exists"
          },
          phone: {
            required: "Please enter phone",
            minlength: "Please enter min-length 10 numbers",
            maxlength: "Please enter max-length 10 numbers",
            valid_phone: "Please enter right phonenumber"
          },
          province: {
            required: "Please select province",
          },
          district: {
            required: "Please select district",
          },
          commune: {
            required: "Please select commune",
          },
          address: {
            required: "Please select address",
          },
          confirmPassword: {
            required: "Please enter confirm password",
            equalTo: "Password doesn't match",
            minlength: "Please enter atleast 8 characters",
          },
          password: {
            required: "Please enter password",
            minlength: "Please enter atleast 8 characters",
          },
          reNewPassword: {
            required: "Please enter confirm password",
            equalTo: "Password doesn't match",
            minlength: "Please enter atleast 8 characters",
          },
          newPassword: {
            required: "Please enter password",
            minlength: "Please enter atleast 8 characters",
          },
        },
      });
      if ($("#formSubmit").valid()) {
        $(this).find("div").remove();
        $(this).append(
          `<div class="form-status" style="margin-left: 8px;"><div class="spinner-border spinner-border-sm"></div></div>`
        );
        $("#formSubmit").submit();
      }
    });
  });


  // Xử lý valide profile form submit
  $(function () {
    const btnSubmit = $("#Submitbtn");
    $(btnSubmit[0]).click(function (e) {
      e.preventDefault();
      // console.log("oke");
      $("#formProfileSubmit").validate({
        rules: {
          name: {
            required: true,
          },
          email: {
            required: true,
            email: true,
          },
          phone: {
            valid_phone: true,
            minlength: 10,
            maxlength: 10,
          }
        },
        messages: {
          email: {
            required: "Please enter email",
          },
          name: {
            required: "Please enter name",
          },
          phone: {
            required: "Please enter phone",
            minlength: "Please enter min-length 10 numbers",
            maxlength: "Please enter max-length 10 numbers",
            valid_phone: "Please enter right phonenumber"
          }
        },
      });
      if ($("#formProfileSubmit").valid()) {
        $(this).find("div").remove();
        $(this).append(
          `<div class="form-status" style="margin-left: 8px;"><div class="spinner-border spinner-border-sm"></div></div>`
        );
        $("#formProfileSubmit").submit();
      }
    });
  });

  $(function () {
    const btnAddCart = $(".add_cart");
    const badge = $("#badge");

    for (let i = 0; i < btnAddCart.length; i++) {
      $(btnAddCart[i]).click(function (e) {
        e.preventDefault();

        const url = new URL(window.location.href);
        // statusLoading({
        //   posLoading: this,
        //   isCompleted: false,
        //   isSuccess: false,
        // });

        $.ajax({
          method: "get",
          contentType: "application/json",
          url:
            url.origin +
            "/cart/add/product/" +
            $(btnAddCart[i]).val(),
          dataType: "json",
          success: function (response) {
            // statusLoading({
            //   posLoading: btnAddCart[i],
            //   isCompleted: true,
            //   isSuccess: true,
            // });
            // console.log(response);
            if (response.amount) {
              $(badge[0]).html(response.amount);
            }
          },
        });
      });
    }
  });


  // Load thông tin tỉnh thành Việt Nam
  $(function () {
    const selectVietNamProvinces = $("#vietNamProvinces");
    const selectVietNamDistrict = $("#vietNamDistrict");
    const selectVietNamCommune = $("#vietNamCommune");

    $.ajax({
      type: "get",
      url: "https://provinces.open-api.vn/api/?depth=1",
      dataType: "json",
      success: function (response) {
        response.forEach((item) => {
          $(selectVietNamProvinces[0]).append(
            `<option class="list-option" value="${item.name}">${item.name}</option>`
          );
        });
      },
    });

    $(selectVietNamDistrict[0]).focus(function (e) {
      e.preventDefault();
      $.ajax({
        type: "get",
        url: "https://provinces.open-api.vn/api/?depth=2",
        dataType: "json",
        success: function (response) {
          const dataFilter = response.filter(
            (data) => data.name == $(selectVietNamProvinces[0]).val()
          );

          $(selectVietNamDistrict[0]).find(".list-option").remove().end();

          dataFilter[0]?.districts.forEach((item) => {
            $(selectVietNamDistrict[0]).append(
              `<option class="list-option" value="${item.name}">${item.name}</option>`
            );
          });
        },
      });
    });

    $(selectVietNamCommune[0]).focus(function (e) {
      e.preventDefault();
      $.ajax({
        type: "get",
        url: "https://provinces.open-api.vn/api/?depth=3",
        dataType: "json",
        success: function (response) {
          let dataFilter = response.filter(
            (data) => data.name == $(selectVietNamProvinces[0]).val()
          );

          dataFilter = dataFilter[0]?.districts.filter(
            (data) => data.name == $(selectVietNamDistrict[0]).val()
          );

          $(selectVietNamCommune[0]).find(".list-option").remove().end();

          dataFilter[0]?.wards.forEach((item) => {
            $(selectVietNamCommune[0]).append(
              `<option class="list-option" value="${item.name}">${item.name}</option>`
            );
          });
        },
      });
    });

    $(selectVietNamProvinces[0]).change(function (e) {
      e.preventDefault();
      $(selectVietNamCommune[0]).find(".list-option").remove().end();
      $(selectVietNamCommune[0]).find(".primary-option-ward").remove().end();
      $(selectVietNamDistrict[0]).find(".list-option").remove().end();
      $(selectVietNamDistrict[0])
        .find(".primary-option-district")
        .remove()
        .end();
    });

    $(selectVietNamDistrict[0]).change(function (e) {
      e.preventDefault();
      $(selectVietNamCommune[0]).find(".list-option").remove().end();
      $(selectVietNamCommune[0]).find(".primary-option-ward").remove().end();
    });
  });


    // Load thong ti gio hang
    $(function () {
      const cartDetails = $(".input-number-cart-detail");
      const priceCarts = $(".price-cart-detail");
      const subtotalCarts = $(".cart-details-total");
      const totalCarts = $(".all-card-total");
      const badge = $("#badge");
      console.log(cartDetails);
      for(let i = 0; i < cartDetails.length; i++)
      {
        $(cartDetails[i]).change(function (e) { 
          e.preventDefault();
          const url = new URL(window.location.href);
          var productId = $(cartDetails[i]).attr("id");
          var productAmount = $(cartDetails[i]).val();
          $.ajax({
            method: "get",
            contentType: "application/json",
            url:
            url.origin +
            "/cart/change/product/" +
            productId + "/" + productAmount,
            dataType: "json",
            success: function (response) {
              // statusLoading({
              //   posLoading: btnAddCart[i],
              //   isCompleted: true,
              //   isSuccess: true,
              // });
              if(response.success)
              {
                var toTalCartDetail = convertMoney(response.cartsPrice);
                var subTotalCarts = convertMoney(response.totalCarts);
                var AlltotalCarts = convertMoney(response.totalCarts+20);
                $(priceCarts[i] ).html(toTalCartDetail);
                $(subtotalCarts[0] ).html(subTotalCarts);
                $(totalCarts[0] ).html(AlltotalCarts);
                $(badge[0]).html(response.totalQuantity);
              }
            },
          });
        });
      }
    });


      // Xử lý chức năng xóa sản phẩm trong cart
  $(function () {
    const btnDeleteProd = $(".btn-delete-card-detail");
    const rowCardDetail = $(".line-card-detail");
    const subtotalCarts = $(".cart-details-total");
    const totalCarts = $(".all-card-total");
    const badge = $("#badge");
    for (let i = 0; i < btnDeleteProd.length; i++) {
      $(btnDeleteProd[i]).click(function (e) {
        e.preventDefault();

        const url = new URL(window.location.href);
        var productId = $(btnDeleteProd[i]).attr("id");
        // statusLoading({
        //   posLoading: this,
        //   isCompleted: false,
        //   isSuccess: false,
        // });

        $.ajax({
          method: "get",
          contentType: "application/json",
          url:
            url.origin +
            "/cart/delete/product/" +
            productId,
          dataType: "json",
          success: function (response) {
            // statusLoading({
            //   posLoading: btnDeleteProd[i],
            //   isCompleted: true,
            //   isSuccess: true,
            // });
            console.log(response);
            if (response.success) {
              console.log(rowCardDetail[i])
              $(rowCardDetail[i]).remove();
              var subTotalCarts = convertMoney(response.totalCarts);
              var AlltotalCarts = convertMoney(response.totalCarts+20);
              $(subtotalCarts[0] ).html(subTotalCarts);
              $(totalCarts[0] ).html(AlltotalCarts);
              $(badge[0]).html(response.totalQuantity);
            }
          },
        });
      });
    }
  });

  $(function () {
    const btnAddCoupon = $(".addCouponButton");
    const inputCoupon = $("#code");
    const discountMoney = $(".discountMoney");
    const totalMoney = $(".totalMoney");
    const checkCouponMessage = $(".checkCouponMessage");

    for (let i = 0; i < btnAddCoupon.length; i++) {
      $(btnAddCoupon[i]).click(function (e) {
        e.preventDefault();

        const url = new URL(window.location.href);

        $.ajax({
          method: "get",
          contentType: "application/json",
          url:
            url.origin +
            "/order/add/coupon/" +
            $(inputCoupon[0]).val(),
          dataType: "json",
          success: function (response) {
            // statusLoading({
            //   posLoading: btnAddCart[i],
            //   isCompleted: true,
            //   isSuccess: true,
            // });
            if (response.status) {
              $(discountMoney[0]).html(convertMoney(response.discountMoney));
              $(totalMoney[0]).html(convertMoney(response.totalMoney));
              $(checkCouponMessage[0]).html(response.message);
            }
            else
            {
              $(checkCouponMessage[0]).html(response.message);
            }
          },
        });
      });
    }
  });



  // Xử lý hiển thị message box
  $(function () {
    $(".close").click(function () {
      $(this).parent(".alert").fadeOut();
    });
  });
})(jQuery);
