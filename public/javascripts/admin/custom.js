$(document).ready(function() {
    $(function() {
        $('#datetimepicker1').datepicker();
    });

    // Xử lý toggle menu
    $(function() {
        $("#menu-toggle").click(function(e) {
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
    $(function() {
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
    $(function() {
        $("#product-single-close").click(function(e) {
            e.preventDefault();

            $("#product_image_area").css("display", "none");
        });
    });

    $(function() {
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
});