"use strict";

(function ($) {
  'use strict';

  $(document).ready(function () {
    $.agni_woocommerce_quickview = {
      init: function init($this) {
        var variation_id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var product_gallery = $this.closest('.agni-quickview-contents').find('.agni-quickview-contents__gallery');
        var product_data = {
          product_id: $this.data('product_id')
        },
            action = 'agni_quickview_additional_variation_images_reset';

        if (variation_id) {
          product_data['variation_id'] = variation_id;
          action = 'agni_quickview_additional_variation_images';
        }

        $.ajax({
          url: cartify_quickview.ajaxurl_wc.toString().replace('%%endpoint%%', action),
          type: "POST",
          data: product_data,
          success: function success(response) {
            if (!response) {
              return;
            }

            product_gallery.html(response);
          }
        });
      },
      reset: function reset($this) {
        $.agni_woocommerce_quickview.init($this);
      }
    };

    $.fn.agni_quickview = function (product_data) {
      var loader_text = 'Loading!',
          close_text = '<i class="lni lni-close"></i>';

      if (!$('.agni-quickview-container').length) {
        $('body').append("<div class=\"agni-quickview-container\">\n                    <div class=\"agni-quickview-container__overlay\"></div>\n                    <div class=\"agni-quickview-container__contents\"></div>\n                </div>");
      }

      var quickview_container = $('.agni-quickview-container'),
          quickview_contents = $('.agni-quickview-container__contents');
      quickview_contents.empty();
      quickview_container.addClass('active');
      quickview_contents.append("<div class=\"agni-quickview-container__loader\">".concat(loader_text, "</div>\n            <div class=\"agni-quickview-container__close\">").concat(close_text, "</div>"));
      $.ajax({
        url: cartify_quickview.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_quickview_contents'),
        type: 'POST',
        data: product_data,
        success: function success(response) {
          quickview_container.find('.agni-quickview-container__loader').remove();
          quickview_contents.append(response);
          var form_variation = quickview_contents.find('.variations_form');
          form_variation.each(function () {
            $(this).wc_variation_form();
          });
          form_variation.trigger('check_variations');
          form_variation.on("show_variation", function (event, variation) {
            $.agni_woocommerce_quickview.init($(this), variation.variation_id);
          });
          form_variation.on('click', '.reset_variations', function () {
            $.agni_woocommerce_quickview.reset(form_variation);
          });
          $('form.cart').on('submit', function (e) {
            e.preventDefault();
            $.cart_contents_loader();
            var form = $(this);
            var atc_btn = form.find('button[type="submit"]');
            var adding_cart_text = "Adding to Cart!";
            var product_data = form.serializeArray();

            if (atc_btn.attr('name') && atc_btn.attr('name') == 'add-to-cart' && atc_btn.attr('value')) {
              product_data.push({
                name: 'add-to-cart',
                value: atc_btn.attr('value')
              });
            }

            product_data.push({
              name: 'action',
              value: 'agni_ajax_add_to_cart'
            });
            product_data.push({
              name: 'security',
              value: cartify_ajax_sidecart.security
            });
            $.cart_loader_show(adding_cart_text);
            $.add_to_cart(atc_btn, product_data);
            $('.agni-quickview-container__close').trigger('click');
          });
        }
      });
    };

    $(document).on('click', '.agni-quickview__button a', function (e) {
      e.preventDefault();
      var product_id = $(this).data('product-id');
      var product_data = {
        product_id: product_id
      };
      $(this).agni_quickview(product_data);
    });
    $(document).on('click', '.agni-quickview-container__close, .agni-quickview-container__overlay', function () {
      var quickview_container = $('.agni-quickview-container'),
          quickview_contents = $('.agni-quickview-container__contents');
      quickview_container.find('.agni-quickview-container__close').remove();
      quickview_container.removeClass('active');
      quickview_contents.empty();
    });
  });
})(jQuery);