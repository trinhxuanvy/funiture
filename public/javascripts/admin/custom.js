$(document).ready(function () {
  $(function () {
    $("#datetimepicker1").datepicker();
  });

  // Xử lý toggle menu
  $(function () {
    $("#menu-toggle").click(function (e) {
      e.preventDefault();
      const sideBar = $("#sidebar");
      const main = $("#main");
      const hasClass = $(sideBar).hasClass("show");

      if (hasClass) {
        $(sideBar).removeClass("show");
        $(main).removeClass("move");
      } else {
        $(sideBar).addClass("show");
        $(main).addClass("move");
      }
    });
  });

  // Xử lý validate form
  $(function () {
    $("#addUserForm").validate({
      rules: {
        email: {
          required: true,
          email: true,
        },
        username: {
          required: true,
          minlength: 8,
          maxlength: 56,
        },
        phone: {
          required: true,
        },
      },
      messages: {
        email: {
          required: "Please enter your email.",
          email: "Please check your email.",
        },
        username: {
          required: "Please enter your name",
          minlength: "Your username must be at least 8 characters long.",
          maxlength: "Your username must be at most 52 characters long.",
        },
        phone: {
          required: "Please enter your phone number.",
        },
      },
    });
  });

  // $(function() {
  //     $("select").select2({
  //         theme: "bootstrap-5",
  //     });
  // });

  // Xử lý popup single product admin page
  $(function () {
    $("#product-single-close").click(function (e) {
      e.preventDefault();

      $("#product_image_area").css("display", "none");
    });
  });

  $(function () {
    const product_overview = $("#vertical");
    if (product_overview.length) {
      product_overview.lightSlider({
        gallery: true,
        item: 1,
        vertical: true,
        verticalHeight: 420,
        thumbItem: 4,
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
  });

  // Xử lý chức năng xóa sản phẩm
  $(function () {
    const btnDeleteProd = $(".btn-delete-prod");
    const trProd = $(".tr-prod");

    for (let i = 0; i < btnDeleteProd.length; i++) {
      $(btnDeleteProd[i]).click(function (e) {
        e.preventDefault();

        const url = new URL(window.location.href);

        $.ajax({
          method: "get",
          contentType: "application/json",
          url:
            url.origin +
            url.pathname +
            "/delete/" +
            $(btnDeleteProd[i]).val() +
            url.search,
          dataType: "json",
          success: function (response) {
            if (response.success) {
              if (!response.status) {
                $(trProd[i]).css("opacity", "0.5");
              } else {
                $(trProd[i]).css("opacity", "1");
              }
            }
          },
        });
      });
    }
  });

  $(function () {
    const input = $("#table-product input");
    const select = $("#table-product select");

    for (let i = 0; i < select.length; i++) {
      $(select[i]).change(function (e) {
        e.preventDefault();

        const id = $(select[i].parentNode.parentNode).attr("id");
        const url = new URL(window.location.href);
        const name = $(select[i]).attr("name");
        var postData = {};
        postData[name] = $(select[i]).val();
        console.log(postData);

        $.ajax({
          method: "post",
          contentType: "application/json",
          url: url.origin + url.pathname + "/update/" + id,
          data: JSON.stringify(postData),
          dataType: "json",
          success: function (response) {
            console.log(response);
            showBoxModal();
          },
        });
      });
    }

    for (let i = 0; i < input.length; i++) {
      if ($(input[i]).attr("type") != "file") {
        $(input[i]).focusout(function (e) {
          e.preventDefault();

          const id = $(input[i].parentNode.parentNode.parentNode).attr("id");
          const url = new URL(window.location.href);
          const name = $(input[i]).attr("name");
          var postData = {};
          postData[name] = $(input[i]).val();

          $.ajax({
            method: "post",
            contentType: "application/json",
            url: url.origin + url.pathname + "/update/" + id,
            data: JSON.stringify(postData),
            dataType: "json",
            success: function (response) {
              console.log(response);
              showBoxModal();
            },
          });
        });
      } else {
        $(input[i]).change(function (e) {
          e.preventDefault();

          const id = $(input[i].parentNode.parentNode.parentNode).attr("id");
          const url = new URL(window.location.href);
          const name = $(input[i]).attr("name");
          var formData = new FormData();
          formData.append(name, $(input[i])[0].files[0]);

          $.ajax({
            method: "post",
            processData: false,
            contentType: false,
            url: url.origin + "/admin/upload",
            data: formData,
            enctype: "multipart/form-data",
            success: function (response) {
              if (response?.success) {
                const link = response?.url;
                var postData = {};
                postData[name] = response?.url;

                $.ajax({
                  method: "post",
                  contentType: "application/json",
                  url: url.origin + url.pathname + "/update/" + id,
                  data: JSON.stringify(postData),
                  dataType: "json",
                  success: function (response) {
                    input[i].parentNode.childNodes[1].src = link;
                    console.log(response);
                    showBoxModal();
                  },
                });
              }
            },
          });
        });
      }
    }
  });
});

function showBoxModal() {
  const modal = $("#boxModal");
  $(modal[0]).css("right", "-100%");
  setTimeout(() => {
    $(modal[0]).css("right", "32px");
  }, 400);

  setTimeout(() => {
    $(modal[0]).css("right", "-100%");
  }, 2000);
}
