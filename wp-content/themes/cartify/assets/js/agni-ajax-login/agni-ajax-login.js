"use strict";

(function ($) {
  'use strict';

  $(document).ready(function () {
    $('body').on('submit', 'form.agni-ajax-login', function (e) {
      e.preventDefault();
      var $this = $(this);
      var formData = $this.serializeArray();
      $('.site-header-icon-myaccount__loader').addClass('active');
      var data = {};
      formData.forEach(function (field) {
        data[field.name] = field.value;
      });
      data['action'] = cartify_ajax_login.action;
      data['security'] = cartify_ajax_login.security;
      $.ajax({
        url: cartify_ajax_login.ajaxurl,
        type: 'POST',
        data: data,
        success: function success(response) {
          console.log(response);

          if (response.success) {
            console.log(response.data);
            location.reload();
          } else {
            console.log(response.data);
            var footer_div = $('.woocommerce-form-login');

            if (!footer_div.siblings('.woocommerce-notices-wrapper').length) {
              $("<div class='woocommerce-notices-wrapper'></div>").insertBefore(footer_div);
            }

            footer_div.siblings('.woocommerce-notices-wrapper').html('<div class="woocommerce-error" role="alert">' + response.data + '</div>');
          }
        },
        complete: function complete() {
          $('.site-header-icon-myaccount__loader').removeClass('active');
        }
      });
    });
  });
})(jQuery);