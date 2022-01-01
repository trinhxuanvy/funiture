$(document).ready(function () {
  $(function () {
    $(".datetimepicker").datepicker();
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
    // $("#addModal").validate({
    //   rules: {
    //     prodName: {
    //       required: true,
    //     },
    //     prodTypeId: {
    //       required: true,
    //     },
    //     brandId: {
    //       required: true,
    //     },
    //     price: {
    //       required: true,
    //     },
    //     amount: {
    //       required: true,
    //     },
    //     primaryImage: {
    //       required: true,
    //     },
    //     secondaryImage_1: {
    //       required: true,
    //     },
    //     secondaryImage_2: {
    //       required: true,
    //     },
    //     secondaryImage_3: {
    //       required: true,
    //     },
    //   },
    //   messages: {
    //     prodName: {
    //       required: "This field can't be empty",
    //     },
    //     prodTypeId: {
    //       required: "This field can't be empty",
    //     },
    //     brandId: {
    //       required: "This field can't be empty",
    //     },
    //     price: {
    //       required: "This field can't be empty",
    //     },
    //     amount: {
    //       required: "This field can't be empty",
    //     },
    //     primaryImage: {
    //       required: "This field can't be empty",
    //     },
    //     secondaryImage_1: {
    //       required: "This field can't be empty",
    //     },
    //     secondaryImage_2: {
    //       required: "This field can't be empty",
    //     },
    //     secondaryImage_3: {
    //       required: "This field can't be empty",
    //     },
    //   },
    // });
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

  // Xử lý chức năng xóa sản phẩm/admins/...
  $(function () {
    const btnDeleteProd = $(".btn-delete-prod");
    const trProd = $(".tr-prod");

    for (let i = 0; i < btnDeleteProd.length; i++) {
      $(btnDeleteProd[i]).click(function (e) {
        e.preventDefault();

        const url = new URL(window.location.href);
        statusLoading({
          posLoading: this,
          isCompleted: false,
          isSuccess: false,
        });

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
            statusLoading({
              posLoading: btnDeleteProd[i],
              isCompleted: true,
              isSuccess: true,
            });

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

  // Xử lý chức năng preview sản phẩm
  $(function () {
    const btnPreviewProd = $(".btn-preview-prod");
    const trProd = $(".tr-prod");
    const previewModel = $("#product_image_area");
    const prodName = $(".product-name");
    const prodCategory = $(".product-category");
    const prodPrice = $(".product-price");
    const prodDescription = $(".product-description");

    for (let i = 0; i < btnPreviewProd.length; i++) {
      $(btnPreviewProd[i]).click(function (e) {
        e.preventDefault();

        const url = new URL(window.location.href);
        statusLoading({
          posLoading: this,
          isCompleted: false,
          isSuccess: false,
        });

        $.ajax({
          method: "get",
          contentType: "application/json",
          url:
            url.origin +
            url.pathname +
            "/" +
            $(btnPreviewProd[i]).val() +
            url.search,
          dataType: "json",
          success: function (response) {
            statusLoading({
              posLoading: btnPreviewProd[i],
              isCompleted: true,
              isSuccess: true,
            });
            if (response.success) {
              if (!response.status) {
                $(previewModel[0]).css("display", "block");
                $(prodName[0]).html(response?.data?.prodName);
                $(prodCategory[0]).html(response?.data?.prodTypeName);
                $(prodPrice[0]).html(
                  convertMoney(response?.data?.price).toString()
                );
                $(prodDescription[0]).html(response?.data?.description);

                const image = $(".lSGallery img");
                const dataThumb = $(".data-thumb-image img");

                response?.data?.prodImage.forEach((item) => {
                  switch (item.type) {
                    case "1":
                      $(image[0]).attr("src", item.imageLink);
                      $(dataThumb[0]).attr("src", item.imageLink);
                      break;
                    case "2":
                      $(image[1]).attr("src", item.imageLink);
                      $(dataThumb[1]).attr("src", item.imageLink);
                      break;
                    case "3":
                      $(image[2]).attr("src", item.imageLink);
                      $(dataThumb[2]).attr("src", item.imageLink);
                      break;
                    case "4":
                      $(image[3]).attr("src", item.imageLink);
                      $(dataThumb[3]).attr("src", item.imageLink);
                      break;
                    default:
                      break;
                  }
                });
              }
            }
          },
        });
      });
    }
  });

  // Xử lý chức năng cập nhật sản phẩm/admins/...
  $(function () {
    const input = $("#table-model input");
    const select = $("#table-model select");

    for (let i = 0; i < select.length; i++) {
      $(select[i]).change(function (e) {
        e.preventDefault();

        const id = $(select[i].parentNode.parentNode.parentNode).attr("id");
        const url = new URL(window.location.href);
        const name = $(select[i]).attr("name");
        var postData = {};
        postData[name] = $(select[i]).val();
        statusUpdate({
          posStatus: select[i],
          posLoading: select[i].parentNode,
          isCompleted: false,
          isSuccess: false,
        });

        $.ajax({
          method: "post",
          contentType: "application/json",
          url: url.origin + url.pathname + "/update/" + id,
          data: JSON.stringify(postData),
          dataType: "json",
          success: function (response) {
            statusUpdate({
              posStatus: select[i],
              posLoading: select[i].parentNode,
              isCompleted: true,
              isSuccess: response?.success,
            });
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
          statusUpdate({
            posStatus: input[i],
            posLoading: input[i].parentNode,
            isCompleted: false,
            isSuccess: false,
          });

          $.ajax({
            method: "post",
            contentType: "application/json",
            url: url.origin + url.pathname + "/update/" + id,
            data: JSON.stringify(postData),
            dataType: "json",
            success: function (response) {
              statusUpdate({
                posStatus: input[i],
                posLoading: input[i].parentNode,
                isCompleted: true,
                isSuccess: response?.success,
              });
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
          statusLoading({
            posLoading: input[i].parentNode,
            isCompleted: false,
            isSuccess: false,
          });

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
                    statusLoading({
                      posLoading: input[i].parentNode,
                      isCompleted: true,
                      isSuccess: true,
                    });
                    $(input[i].parentNode).find("img").attr("src", link);
                  },
                });
              }
            },
          });
        });
      }
    }
  });

  // Thêm validate phone
  jQuery.validator.addMethod("valid_number", function (value) {
    var regex = /^[0-9]*$/gm;
    return value.trim().match(regex);
  });

  // Thêm validate username
  jQuery.validator.addMethod("valid_username", function (value) {
    const url = new URL(window.location.href);
    var data = $.ajax({
      method: "get",
      contentType: "application/json",
      async: false,
      url: url.origin + url.pathname + "/" + value,
      dataType: "json",
      success: function (response) {
        return response;
      },
    });
    return !data.responseJSON;
  });

  // Xử lý thêm sản phẩm/admins
  $(function () {
    const btnSubmit = $("#btnSubmit");
    $(btnSubmit[0]).click(function (e) {
      e.preventDefault();
      $("#formSubmit").validate({
        rules: {
          price: {
            required: true,
            min: 0,
          },
          amount: {
            required: true,
            min: 0,
          },
          email: {
            required: true,
            email: true,
          },
          dateOfBirth: {
            required: true,
            date: true,
          },
          avatarLink: {
            required: true,
          },
          phone: {
            required: true,
            valid_number: true,
            minlength: 10,
            maxlength: 10,
          },
          identityCard: {
            required: true,
            valid_number: true,
          },
          username: {
            required: true,
            valid_username: true,
          },
          password: {
            required: true,
            minlength: 8,
          },
          confirmPassword: {
            required: true,
            equalTo: "#password",
            minlength: 8,
          },
        },
        messages: {
          prodName: {
            required: "Please enter product name",
          },
          prodTypeId: {
            required: "Please choose 1 product type",
          },
          brandId: {
            required: "Please choose 1 brand",
          },
          price: {
            required: "Please enter price",
            min: "Min: 0",
          },
          amount: {
            required: "Please enter amount",
            min: "Min: 0",
          },
          primaryImage: {
            required: "Please choose 1 file",
          },
          secondaryImage_1: {
            required: "Please choose 1 image",
          },
          secondaryImage_2: {
            required: "Please choose 1 image",
          },
          secondaryImage_3: {
            required: "Please choose 1 image",
          },
          adminName: {
            required: "Please enter admin name",
          },
          identityCard: {
            required: "Please enter identity card",
          },
          email: {
            required: "Please enter email",
          },
          username: {
            required: "Please enter username",
            valid_username: "Username already exists",
          },
          phone: {
            required: "Please enter phone",
            minlength: "Min length: 10 numbers",
            maxlength: "Max length: 10 numbers",
            valid_number: "Phone number just contains 0-9",
          },
          identityCard: {
            required: "Please enter phone",
            valid_number: "Identity Card just contains 0-9",
          },
          address: {
            required: "Please enter address",
          },
          dateOfBirth: {
            required: "Please enter date of birth",
          },
          avatarLink: {
            required: "Please choose 1 image",
          },
          // brand
          brandName: {
            required: "Please enter brand name",
          },
          // category
          prodTypeName: {
            required: "Please enter category",
          },
          // customer
          cusName: {
            required: "Please enter customer name",
          },
          // profile
          password: {
            required: "Please enter password",
            minlength: "Min length: 8",
          },
          confirmPassword: {
            required: "Please enter confirm password",
            minlength: "Min length: 8",
            equalTo: "Password doesn't match",
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

  // Xử lý hiển thị message box
  $(function () {
    $(".close").click(function () {
      $(this).parent(".alert").fadeOut();
    });
  });

  // Thêm validate time start-end
  jQuery.validator.addMethod("valid_form_statistic", function (value) {
    var inputStart = new Date($("#formDay input[name='startDate']").val());

    return new Date(value) > inputStart;
  });

  // Xử lý phân tích load chart
  $(function () {
    getChart({});

    // Xử lý các button day month year
    $("#btnGroupStatistic button").click(function (e) {
      e.preventDefault();
      $("#btnGroupStatistic button").removeClass("btn-active");
      const btnActive = $(this).hasClass("btn-active");
      if (btnActive) {
        $(this).removeClass("btn-active");
      } else {
        $(this).addClass("btn-active");
      }

      const type = $(this).val();
      $("#dayStatistic").css("display", "none");
      $("#monthStatistic").css("display", "none");
      $("#yearStatistic").css("display", "none");

      switch (type) {
        case "day":
          $("#dayStatistic").css("display", "block");
          break;
        case "month":
          $("#monthStatistic").css("display", "block");
          break;
        case "year":
          $("#yearStatistic").css("display", "block");
          break;
        default:
          break;
      }
    });

    // XỬ lý button config
    $("#configStatistic").click(function (e) {
      e.preventDefault();
      const formActive = $("#formStatistic").css("display");
      if (formActive == "none") {
        $("#formStatistic").css("display", "block");
      } else {
        $("#formStatistic").css("display", "none");
      }
    });

    $("#startDay").datepicker({ format: "mm-dd-yyyy", autoclose: true });
    $("#endDay").datepicker({ format: "mm-dd-yyyy", autoclose: true });

    $("#btnSubmitStatistic").click(function (e) {
      e.preventDefault();

      // Validate form
      $("#formDay").validate({
        rules: {
          endDate: {
            valid_form_statistic: true,
            required: true,
            date: true,
          },
        },
        messages: {
          endDate: {
            valid_form_statistic: "Start date must be less than end date",
            required: "Please enter end date",
            date: "Please enter date",
          },
          startDate: {
            required: "Please enter start date",
          },
        },
      });

      if ($("#formDay").valid()) {
        $("#formStatistic").css("display", "none"); // Ẩn form
        $(".loading").css("visibility", "initial"); // Hiển thị loading
        const url = new URL(window.location.href);
        const inputStart = $("#formDay input[name='startDate']").val();
        const inputEnd = $("#formDay input[name='endDate']").val();

        // Xử lý ajax để get data
        $.ajax({
          type: "get",
          url:
            url.origin + url.pathname + "/day/" + inputStart + "/" + inputEnd,
          dataType: "json",
          contentType: "application/json",
          success: function (response) {
            if (response.success) {
              $(".loading").css("visibility", "hidden");
              getChart(response);
              $(".show-range").html(response.start + " to " + response.end);
            }
          },
        });
      }
    });
  });
});

function statusUpdate({
  posStatus = null,
  posLoading = null,
  isCompleted = false,
  isSuccess = false,
}) {
  if (isCompleted) {
    $(posLoading).find("div").remove();

    if (isSuccess) {
      $(posStatus).addClass("is-valid");
    } else {
      $(posStatus).addClass("is-invalid");
    }

    setTimeout(() => {
      $(posStatus).removeClass("is-valid");
      $(posStatus).removeClass("is-invalid");
    }, 1000);
  } else {
    $(posLoading).append(
      `<div class="form-status"><div class="spinner-border spinner-border-sm"></div></div>`
    );
  }
}

function statusLoading({
  posLoading = null,
  isCompleted = false,
  isSuccess = false,
}) {
  if (isCompleted) {
    $(posLoading).find("div").remove();
    $(posLoading).find("span").remove();
  } else {
    $(posLoading).append(`<span style="
    z-index: 1;
    width: 100%;
    height: 100%;
    background: #958c8c73;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    "></span>`);
    $(posLoading).append(
      `<div style="
      z-index: 2; 
      position: absolute; 
      top: 50%; 
      left: 50%; 
      transform: 
      translate(-50%, -50%);
      "><div class="spinner-border spinner-border-sm text-light"></div></div>`
    );
  }
}

function convertMoney(money) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(money);
}

function getChart(data) {
  var dataPoints = [];
  var titleX = data.titleX || "";
  var titleY = data.titleY || "";
  var options = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: titleX,
    },
    axisX: {
      valueFormatString: "DD-MM-YYYY",
    },
    axisY: {
      title: titleY,
      titleFontSize: 24,
    },
    data: [
      {
        type: "spline",
        yValueFormatString: "$#,###.##",
        dataPoints: dataPoints,
      },
    ],
  };

  if (data?.data?.length) {
    for (let i = 0; i < data?.data?.length; i++) {
      dataPoints.push({
        x: new Date(data.data[i].date),
        y: data.data[i].units,
      });
    }
  } else {
    dataPoints.push({
      x: "",
      y: 800,
    });
    dataPoints.push({
      x: "",
      y: 1000,
    });
    dataPoints.push({
      x: "",
      y: 1200,
    });
    dataPoints.push({
      x: "",
      y: 1400,
    });
    dataPoints.push({
      x: "",
      y: 1600,
    });
  }

  $("#chartContainer").CanvasJSChart(options);
}
