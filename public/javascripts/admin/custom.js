$(document).ready(function () {
    $(function () {
        $('#datetimepicker1').datepicker();
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
                    email: true
                },
                username: {
                    required: true,
                    minlength: 8,
                    maxlength: 56
                },
                phone: {
                    required: true,
                }
            },
            messages: {
                email: {
                    required: "Please enter your email.",
                    email: "Please check your email."
                },
                username: {
                    required: "Please enter your name",
                    minlength: "Your username must be at least 8 characters long.",
                    maxlength: "Your username must be at most 52 characters long.",
                },
                phone: {
                    required: "Please enter your phone number."
                }
            }
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
        const product_overview = $('#vertical');
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
                responsive: [{
                    breakpoint: 991,
                    settings: {
                        item: 1,

                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        item: 1,
                        slideMove: 1,
                        verticalHeight: 350,
                    }
                }
                ]
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
                $.ajax({
                    method: "get",
                    contentType: "application/json",
                    url: window.location.href + "/delete/" + $(btnDeleteProd[i]).val(),
                    dataType: "json",
                    success: function (response) {
                        if (response.success) {
                            if (response.status) {
                                $(trProd[i]).css("opacity", "0.5");
                            } else {
                                $(trProd[i]).css("opacity", "1");
                            }
                        }
                    }
                });
            });
        }

    });

    // Xử lý hiển thị khi thay đổi image
    $(function () {
        const btnPrimaryImage = $("#wrapperContent .primary-image-input");
        const image = $("#wrapperContent .primary-image img");

        for (let i = 0; i < btnPrimaryImage.length; i++) {
            $(btnPrimaryImage[i]).change(function (e) {
                e.preventDefault();

                const file = btnPrimaryImage[i].files;
                const fileReader = new FileReader();

                fileReader.onload = function (e) {
                    const src = e.target.result;
                    image[i].src = src;
                }

                fileReader.readAsDataURL(file[0]);
            });
        }

        const btnSecondaryImage1 = $("#wrapperContent .secondary-image-input-1");
        const imageSecondary1 = $("#wrapperContent .secondary-image-1 img");

        for (let i = 0; i < btnSecondaryImage1.length; i++) {
            $(btnSecondaryImage1[i]).change(function (e) {
                e.preventDefault();

                const file = btnSecondaryImage1[i].files;
                const fileReader = new FileReader();

                fileReader.onload = function (e) {
                    const src = e.target.result;
                    imageSecondary1[i].src = src;
                }

                fileReader.readAsDataURL(file[0]);
            });
        }

        const btnSecondaryImage2 = $("#wrapperContent .secondary-image-input-2");
        const imageSecondary2 = $("#wrapperContent .secondary-image-2 img");

        for (let i = 0; i < btnSecondaryImage2.length; i++) {
            $(btnSecondaryImage2[i]).change(function (e) {
                e.preventDefault();

                const file = btnSecondaryImage2[i].files;
                const fileReader = new FileReader();

                fileReader.onload = function (e) {
                    const src = e.target.result;
                    imageSecondary2[i].src = src;
                }

                fileReader.readAsDataURL(file[0]);
            });
        }

        const btnSecondaryImage3 = $("#wrapperContent .secondary-image-input-3");
        const imageSecondary3 = $("#wrapperContent .secondary-image-3 img");

        for (let i = 0; i < btnSecondaryImage3.length; i++) {
            $(btnSecondaryImage3[i]).change(function (e) {
                e.preventDefault();

                const file = btnSecondaryImage3[i].files;
                const fileReader = new FileReader();

                fileReader.onload = function (e) {
                    const src = e.target.result;
                    imageSecondary3[i].src = src;
                }

                fileReader.readAsDataURL(file[0]);
            });
        }
    });
});