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
});