$(function() {

  var isEmailSelected = true;
  var isMailSelected;
  var isPhoneSelected;
  var request;
  var fadeDur = 1000;
  var shortFadeDur = 500;
  var ERROR_MESSAGE = 'Pease complete the required fields.';

  $('#contact-form .chosen-container .chosen-results li').click(function(e){
    e.preventDefault();
    alert($(this).index());
    return false;
  })

  $('.no-touch #contact-form select').chosen().change(function(e) {
    e.preventDefault();
    if ($(this).val().indexOf('http') > -1) {
      var url = $(this).val();
      window.open(url , '_blank');
      $('#contact-form select').val('0');
      $('#contact-form select').trigger("chosen:updated");
    }
    return false;
  });

  $('.touch #contact-form select').change(function(e) {
    e.preventDefault();
    if ($(this).val().indexOf('http') > -1) {
      var url = $(this).val();
      window.location = url;
      $('#contact-form select').val('0');
      $('#contact-form select').trigger("chosen:updated");
    }
    return false;
  });

  $('#contact-form #email').focusin(function() {
    $(this).attr('placeholder', SIGNUP_CTA);
  });

  $('#contact-form #email').focusout(function() {
    $(this).attr('placeholder', SIGNUP_LABEL);
  });

  $('#contact-form').submit(function(event) {

    event.preventDefault();
    if (validateForm()) {
      // Abort any pending request
      if (request) {
        request.abort();
      }
      // setup some local variables
      var $form = $(this);
      var urlStr = $form.attr('action');

      // Let's select and cache all the fields
      var $inputs = $form.find("input, select, button, textarea");

      // Serialize the data in the form
      var serializedData = {};
      $.each($form.serializeArray(), function(_, kv) {
        serializedData[kv.name] = kv.value;
      });

      // Let's disable the inputs for the duration of the Ajax request.
      // Note: we disable elements AFTER the form data has been serialized.
      // Disabled form elements will not be serialized.
      $inputs.prop("disabled", true);

      var data = getFormattedData(serializedData);

      // Fire off the request to /form.php
      request = $.ajax({
        url: urlStr,
        type: "post",
        data: data,
        dataType: 'json'
      });

      // Callback handler that will be called on success
      request.done(function(response, textStatus, jqXHR) {
        // Log a message to the console
        if (response.status == 'success') {
          hideForm();
        } else if (response.status == 'error') {
          showErrorMessage(response.message);
        } else {
          showErrorMessage('An unknown error has occurred. Please try again.');
        }
      });

      // Callback handler that will be called on failure
      request.fail(function(jqXHR, textStatus, errorThrown) {
      });

      // Callback handler that will be called regardless
      // if the request failed or succeeded
      request.always(function() {
        // Reenable the inputs
        $inputs.prop("disabled", false);
      });
    } else {
      var topInput = $('#contact-form .error').first();

      $('html, body').animate({
        scrollTop: topInput.closest('fieldset').offset().top - $('#header').height() - $('#wpadminbar').height() - 60
      }, 1000);
      //topInput.focus();
    }

    return false;
  });

  function getFormattedData(data) {

    if ($("select[name='dates']").length) {
      data['dates'] = $("select[name='dates']").val().join(', ');
    }
    return data;
  }

  function validateForm() {
    hideErrorMessage();

    var hasError = false;
    removeErrors();

    var $inputs = $('#contact-form').find("input, select, button, textarea");

    $('#contact-form .error').removeClass('error');

    // Validate required fields
    $inputs.each(function() {
      var val = $(this).val();
      if ($(this).prop('required') && !val) {
        $(this).addClass('error');
        hasError = true;
        if ($(this).hasClass('chosen-select')) {
          $(this).closest('fieldset').find('.chosen-container').addClass('error');
        }
      }

      if ($(this).hasClass('chosen-select') && !val) {
        hasError = true;
        $(this).closest('fieldset').find('.chosen-container').addClass('error');
      }
    });

    // Validate email
    if ($('#email').length > 0) {
      if (!validateRequired('#email')) {
        hasError = true;
        $('#email').addClass('error').addClass('required');
      } else if (!isEmail($('#email').val())) {
        hasError = true;
        $('#email').addClass('error').addClass('invalid');
      }
    }

    if (hasError) {
      showErrorMessage(ERROR_MESSAGE);
    }

    return !hasError;
  }

  function validateEmail() {
    return true;
  }

  function validatePhone() {
    return true;
  }

  function validateRequired(selector) {
    var val = $(selector).val();
    if (!val || !val.length) {
      return false;
    }
    return true;
  }

  function removeErrors() {
    $('.contact-form .form-holder .retry').removeClass('error').removeClass('required').removeClass('invalid');
  }

  function hideForm(isError) {
    if (isError) {
      showError();
    } else {

      $('html, body').animate({
        scrollTop: $('#contact-form').closest('.half').offset().top - $('#header').height() - $('#wpadminbar').height() - 40
      });

      $('.contact-form .form-holder form').fadeOut(function() {
        showThankYou();
      });
    }
  }

  function showThankYou() {
    $('.contact-form .form-holder .success').hide().fadeIn(fadeDur);
    $(window).trigger('scroll');
    $(window).trigger('resize');
  }

  function showError() {
    $('.contact-form .form-holder p.retry').hide().fadeIn(fadeDur, function() {
      setTimeout(function() {
        $('.contact-form .form-holder p.retry').fadeOut(fadeDur, function() {
          resetForm();
          $('.contact-form .form-holder form').fadeIn(fadeDur);
        })
      }, 3000);
    });
  }

  function showErrorMessage(message) {
    $('.contact-form .error-message').text(message);
    $('.contact-form .error-message').hide().fadeIn();

    if (message.indexOf('email') > -1) {
      $('#email').addClass('error');
    }

    $(window).trigger('resize');
  }

  function hideErrorMessage() {
    $('.contact-form .error-message').text('');
    $('.contact-form .error-message').hide();
    $(window).trigger('resize');
  }

  function resetForm() {
    isEmailSelected = true;
    isMailSelected = false;
    isPhoneSelected = false;
    $('.contact-form .form-holder form input').val(null);
    $('.contact-form .form-holder form').addClass('email-active');
    $('.contact-form .email-box').addClass('active');
    $(window).trigger('scroll');
    $(window).trigger('resize');
  }

  function isEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

});
