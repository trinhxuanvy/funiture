$(document).ready(function () {
  $(function () {
    $(".datetimepicker").datepicker({ autoclose: true });
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

  // Xử lý chức năng lock sản phẩm/admins/...
  $(function () {
    const btnLock = $(".btn-lock");
    const trProd = $(".tr-prod");

    for (let i = 0; i < btnLock.length; i++) {
      $(btnLock[i]).click(function (e) {
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
            "/lock/" +
            $(btnLock[i]).val() +
            url.search,
          dataType: "json",
          success: function (response) {
            statusLoading({
              posLoading: btnLock[i],
              isCompleted: true,
              isSuccess: response.success,
            });

            if (response.success) {
              if (!response.status) {
                $(trProd[i]).css("opacity", "0.5");
                $(btnLock[i]).attr("title", "Unlock");
              } else {
                $(trProd[i]).css("opacity", "1");
                $(btnLock[i]).attr("title", "Lock");
              }
            }
          },
        });
      });
    }
  });

  // Xử lý chức năng xóa sản phẩm/admins/...
  $(function () {
    const btnDelete = $(".btn-delete");
    const trProd = $(".tr-prod");

    for (let i = 0; i < btnDelete.length; i++) {
      $(btnDelete[i]).click(function (e) {
        e.preventDefault();

        const url = new URL(window.location.href);
        statusLoading({
          posLoading: this,
          isCompleted: false,
        });

        $.ajax({
          method: "get",
          contentType: "application/json",
          url:
            url.origin +
            url.pathname +
            "/delete/" +
            $(btnDelete[i]).val() +
            url.search,
          dataType: "json",
          success: function (response) {
            statusLoading({
              posLoading: btnDelete[i],
              isCompleted: true,
              isSuccess: response.success,
            });

            if (response.success) {
              $(trProd[i]).remove();
            }
          },
        });
      });
    }
  });

  // Xử lý chức năng reset password admin
  $(function () {
    const btnReset = $(".btn-reset");

    for (let i = 0; i < btnReset.length; i++) {
      $(btnReset[i]).click(function (e) {
        e.preventDefault();

        const url = new URL(window.location.href);
        statusLoading({
          posLoading: this,
          isCompleted: false,
        });

        $.ajax({
          method: "get",
          contentType: "application/json",
          url:
            url.origin +
            url.pathname +
            "/reset/" +
            $(btnReset[i]).val() +
            url.search,
          dataType: "json",
          success: function (response) {
            statusLoading({
              posLoading: btnReset[i],
              isCompleted: true,
              isSuccess: response.success,
            });
          },
        });
      });
    }
  });

  // Xử lý chức năng preview sản phẩm
  $(function () {
    const btnPreviewProd = $(".btn-preview-prod");
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
              isSuccess: response.success,
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
        $(input[i]).change(function (e) {
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

  // Thêm validate username
  jQuery.validator.addMethod("valid_code", function (value) {
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

  // Thêm validate date
  jQuery.validator.addMethod("valid_end_date", function (value) {
    const startDateStr = $("#addCouponModal #startDate");
    const startDate = new Date($(startDateStr[0]).val());
    const endDate = new Date(value);
    return startDate < endDate;
  });

  // Xử lý thêm sản phẩm/admins
  $(function () {
    const btnSubmit = $("#btnSubmit");
    $(btnSubmit[0]).click(function (e) {
      e.preventDefault();
      $("#formSubmit").validate({
        rules: {
          endDate: {
            required: true,
            valid_end_date: true,
          },
          amount: {
            required: true,
            min: 0,
          },
          promotionValue: {
            required: true,
            min: 0,
          },
          code: {
            required: true,
            valid_code: true,
          },
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
          amount: {
            required: "Please enter amount",
            min: "Min: 0",
          },
          promotionValue: {
            required: "Please enter promotion value",
            min: "Min: 0",
          },
          code: {
            required: "Please enter code",
            valid_code: "Code already exists",
          },
          startDate: {
            required: "Please enter start date",
          },
          endDate: {
            required: "Please enter end date",
            valid_end_date: "End date must be larger than start date",
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

    $("#startDay").datepicker({ format: "mm-dd-yyyy", autoclose: true });
    $("#endDay").datepicker({ format: "mm-dd-yyyy", autoclose: true });
    $("#startMonth").datepicker({
      format: "mm-yyyy",
      viewMode: "months",
      minViewMode: "months",
      autoclose: true,
    });
    $("#endMonth").datepicker({
      format: "mm-yyyy",
      viewMode: "months",
      minViewMode: "months",
      autoclose: true,
    });
    $("#startYear").datepicker({
      format: "yyyy",
      viewMode: "years",
      minViewMode: "years",
      autoclose: true,
    });
    $("#endYear").datepicker({
      format: "yyyy",
      viewMode: "years",
      minViewMode: "years",
      autoclose: true,
    });

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

    // Statistic day
    $("#btnSubmitStatisticDay").click(function (e) {
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

    // Statistic month
    $("#btnSubmitStatisticMonth").click(function (e) {
      e.preventDefault();
      $("#formStatistic").css("display", "none"); // Ẩn form
      $(".loading").css("visibility", "initial"); // Hiển thị loading
      const url = new URL(window.location.href);
      const inputStart = $("#formMonth input[name='startDate']").val();
      const inputEnd = $("#formMonth input[name='endDate']").val();

      // Xử lý ajax để get data
      $.ajax({
        type: "get",
        url:
          url.origin + url.pathname + "/month/" + inputStart + "/" + inputEnd,
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
    });

    // Statistic year
    $("#btnSubmitStatisticYear").click(function (e) {
      e.preventDefault();
      $("#formStatistic").css("display", "none"); // Ẩn form
      $(".loading").css("visibility", "initial"); // Hiển thị loading
      const url = new URL(window.location.href);
      const inputStart = $("#formYear input[name='startDate']").val();
      const inputEnd = $("#formYear input[name='endDate']").val();

      // Xử lý ajax để get data
      $.ajax({
        type: "get",
        url: url.origin + url.pathname + "/year/" + inputStart + "/" + inputEnd,
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
    });
  });

  // Xử lý button sort product
  $(function () {
    $("#btnSort").click(function (e) {
      e.preventDefault();
      const formSort = $("#formSort");
      const hasClass = $(formSort[0]).hasClass("form-sort-active");

      if (hasClass) {
        $(formSort[0]).removeClass("form-sort-active");
      } else {
        $(formSort[0]).addClass("form-sort-active");
      }
    });
  });

  // Xử lý preview order detail
  $(function () {
    const btnPreview = $(".btn-preview-order");
    const tablePreview = $(".table-product-detail tbody");
    const previewModel = $("#product_image_area");

    for (let i = 0; i < btnPreview.length; i++) {
      $(btnPreview[i]).click(function (e) {
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
          url: url.origin + url.pathname + "/" + $(btnPreview[i]).val(),
          dataType: "json",
          success: function (response) {
            statusLoading({
              posLoading: btnPreview[i],
              isCompleted: true,
              isSuccess: true,
            });

            if (response.success) {
              if (!response.status) {
                $(previewModel[0]).css("display", "block");
                $(tablePreview[0]).find("tr").remove();
                response.data.forEach((item) => {
                  $(tablePreview[0]).append(`
                  <tr>
                    <th>
                      <div class="mt-3 mb-3">
                        <div class="media">
                          <img
                            src="${item.productImg}"
                            alt="${item.productName}"
                          />
                        ${item.productName}
                        </div>
                      </div>
                    </th>
                    <td>
                      <div>${convertMoney(item.price)}</div>
                    </td>
                    <td>
                      <div>${item.amount}</div>
                    </td>
                    <td><div class="money">${convertMoney(
                      item.amount * item.price
                    )}</div></td>
                  </tr>
                  `);
                });
              } else {
                $(tablePreview[0]).find("tr").remove();
              }
            }
          },
        });
      });
    }
  });

  // Xử lý money
  $(function () {
    const money = $(".money");

    for (let i = 0; i < money.length; i++) {
      money[i].innerHTML = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(money[i].innerHTML);
    }
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

    if (isSuccess) {
      $(posLoading).addClass("btn-outline-success");

      setTimeout(() => {
        $(posLoading).removeClass("btn-outline-success");
      }, 1000);
    } else {
      $(posLoading).addClass("btn-outline-danger");

      setTimeout(() => {
        $(posLoading).removeClass("btn-outline-danger");
      }, 1000);
    }
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
  CanvasJS.addColorSet("primary", ["#EB5E28"]);

  var dataPoints = [];
  var titleX = data.titleX || "";
  var titleY = data.titleY || "";
  var options = {
    animationEnabled: true,
    colorSet: "primary",
    zoomEnabled: true,
    zoomType: "x",
    legend: {
      horizontalAlign: "right",
      verticalAlign: "center",
    },
    theme: "light2",
    title: {
      text: titleX,
    },
    axisY: {
      title: titleY,
      titleFontSize: 24,
    },
    data: [
      {
        type: "column",
        yValueFormatString: "$#,###.##",
        dataPoints: dataPoints,
      },
    ],
  };

  if (data?.data?.length) {
    for (let i = 0; i < data?.data?.length; i++) {
      dataPoints.push({
        label: data.data[i].date,
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

  const chartContainer = $("#chartContainer");
  if (chartContainer.length) {
    $("#chartContainer").CanvasJSChart(options);
  }
}
