(function($) {
    "use strict";

    // Options for Message
    //----------------------------------------------
    var options = {
        'btn-loading': '<i class="fa fa-spinner fa-pulse"></i>',
        'btn-success': '<i class="fa fa-check"></i>',
        'btn-error': '<i class="fa fa-remove"></i>',
        'register-msg-success': 'All Good! Please Login',
        'login-msg-success': 'All Good! Redirecting',
        'login-msg-error': 'Wrong login credentials!',
        'register-msg-error': 'User cannot be added! Sorry',
        'useAJAX': true,
    };

    // Login Form
    //----------------------------------------------
    // Validation
    $("#login-form").validate({
        rules: {
            email: "required",
            password: "required",
        },
        errorClass: "form-invalid"
    });

    // Form Submission
    $("#login-form").submit(function() {
        remove_loading($(this));

        if(options['useAJAX'] == true)
        {
            submitForm($(this), '/user/login', options['login-msg-success'], options['login-msg-error'], '/cms/key');

            // Cancel the normal submission.
            // If you don't want to use AJAX, remove this
            return false;
        }
    });

    // Register Form
    //----------------------------------------------
    // Validation
    $("#register-form").validate({
        rules: {
            username: "required",
            password: {
                required: true,
                minlength: 5
            },
            email: {
                required: true,
                email: true
            },
            name : {
                required: true,
            },
            reg_agree: "required",
        },
        errorClass: "form-invalid",
        errorPlacement: function( label, element ) {
            if( element.attr( "type" ) === "checkbox" || element.attr( "type" ) === "radio" ) {
                element.parent().append( label ); // this would append the label after all your checkboxes/labels (so the error-label will be the last element in <div class="controls"> )
            }
            else {
                label.insertAfter( element ); // standard behaviour
            }
        }
    });

    // Form Submission
    $("#register-form").submit(function() {
        remove_loading($(this));

        if(options['useAJAX'] == true)
        {
            // Dummy AJAX request (Replace this with your AJAX code)
            // If you don't want to use AJAX, remove this
            submitForm($(this), '/user', options['register-msg-success'], options['register-msg-error']);

            // Cancel the normal submission.
            // If you don't want to use AJAX, remove this
            return false;
        }
    });

    // Forgot Password Form
    //----------------------------------------------
    // Validation
    $("#forgot-password-form").validate({
        rules: {
            fp_email: "required",
        },
        errorClass: "form-invalid"
    });

    // Form Submission
    $("#forgot-password-form").submit(function() {
        remove_loading($(this));

        if(options['useAJAX'] == true)
        {
            // Dummy AJAX request (Replace this with your AJAX code)
            // If you don't want to use AJAX, remove this
            dummy_submit_form($(this));

            // Cancel the normal submission.
            // If you don't want to use AJAX, remove this
            return false;
        }
    });

    // Loading
    //----------------------------------------------
    function remove_loading($form)
    {
        $form.find('[type=submit]').removeClass('error success');
        $form.find('.login-form-main-message').removeClass('show error success').html('');
    }

    function form_loading($form)
    {
        $form.find('[type=submit]').addClass('clicked').html(options['btn-loading']);
    }

    function form_success($form, msgKeyFromOptions)
    {
        $form.find('[type=submit]').addClass('success').html(options['btn-success']);
        $form.find('.login-form-main-message').addClass('show success').html(msgKeyFromOptions);
    }

    function form_failed($form, msgKeyFromOptions)
    {
        $form.find('[type=submit]').addClass('error').html(options['btn-error']);
        $form.find('.login-form-main-message').addClass('show error').html(msgKeyFromOptions);
    }

    function submitForm($form, url, msgSuccess, msgError, redirectionUrl){
        console.log('Submit Form');
        if($form.valid()) {
            form_loading($form);
            $.ajax({
                type: "POST",
                url: url,
                data: $form.serialize(),
                success: function(response){
                    console.log(response);
                    if (response.success !== "false"){
                        form_success($form, msgSuccess);
                        if (redirectionUrl){
                            window.location.href = redirectionUrl;
                        }
                    } else {
                        form_failed($form, _.isArray(response.message) ? response.message[0] : msgError);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            });
        }
    }
    // Dummy Submit Form (Remove this) for forgot password @TODO
    //----------------------------------------------
    // This is just a dummy form submission. You should use your AJAX function or remove this function if you are not using AJAX.
    function dummy_submit_form($form)
    {
        if($form.valid())
        {
            form_loading($form);

            setTimeout(function() {
                form_success($form, 'Done');
            }, 2000);
        }
    }

})(jQuery);