"use strict";

(function ($) {
  'use strict';

  $(document).ready(function () {
    $.agni_additional_variation_images = {
      product_gallery_loader_show: function product_gallery_loader_show(product_gallery, loader_class, text) {
        product_gallery.append('<div class="' + loader_class + '__loader"><span>' + text + '</span></div>');
      },
      product_gallery_loader_hide: function product_gallery_loader_hide(product_gallery) {
        product_gallery.find('.woocommerce-product-gallery__loader').remove();
      },
      product_gallery_default: function product_gallery_default($this) {
        var variation_id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var product_gallery = $this.closest('.product').find('.woocommerce-product-gallery'),
            action = 'agni_additional_variation_images_reset';
        var loading_variation_text = 'Loading',
            loader_append_class = 'woocommerce-product-gallery';
        var product_data = {
          product_id: $this.data('product_id')
        };

        if (variation_id) {
          product_data['variation_id'] = variation_id;
          action = 'agni_additional_variation_images';
        }

        $.agni_additional_variation_images.product_gallery_loader_show(product_gallery, loader_append_class, loading_variation_text);
        $.ajax({
          url: cartify_additional_variation_images.ajaxurl_wc.toString().replace('%%endpoint%%', action),
          type: "POST",
          data: product_data,
          success: function success(response) {
            if (!response) {
              return;
            }

            product_gallery.html($(response).html());
            var product_gallery_slider = product_gallery.parent('.agni-product-layout-block-images').length !== 0 ? product_gallery.parent('.agni-product-layout-block-images') : product_gallery;
            var product_gallery_wrapper = product_gallery.find('.woocommerce-product-gallery__wrapper');

            if (product_gallery_slider.is_product_gallery_feature_active('has-hoverzoom')) {
              $.agni_woocommerce_product_easyzoom.insert_class(product_gallery_wrapper);
              $.agni_woocommerce_product_easyzoom.init(product_gallery);
            }

            if (product_gallery_slider.is_product_gallery_feature_active('has-lightbox')) {
              var product_gallery_wrapper = product_gallery.find('.woocommerce-product-gallery__wrapper');
              $.agni_woocommerce_product_photoswipe.product_gallery_lightbox(product_gallery_wrapper);
            }

            $.agni_scripts.product_gallery_slider(product_gallery);
            $.agni_additional_variation_images.product_gallery_loader_hide(product_gallery);
          }
        });
      },
      reset: function reset($this, callback) {
        $.agni_additional_variation_images.product_gallery_default($this);

        if (callback) {
          callback();
        }
      }
    };
    $("form.variations_form").on("show_variation", function (event, variation) {
      var $this = $(this);
      var variation_id = variation.variation_id;
      $.agni_additional_variation_images.product_gallery_default($this, variation_id);
    });
    $('form.variations_form').on('click', '.reset_variations', function () {
      var $this = $(this);
      var form = $this.closest("form.variations_form");
      $.agni_additional_variation_images.reset(form);
    });
  });
})(jQuery);