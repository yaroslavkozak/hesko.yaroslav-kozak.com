"use strict";

(function ($) {
  'use strict';

  $(document).ready(function () {
    $.fn.add_to_compare = function (product_data, remove_from_compare_text) {
      var $this = $(this),
          compare_container = $this.closest('.agni-add-to-compare'),
          compare_buttons = $this.closest('.agni-add-to-compare').find('a');
      $.ajax({
        url: cartify_compare.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_compare_set_cookie'),
        type: 'POST',
        data: product_data,
        success: function success(response) {
          console.log(response);
          compare_buttons.removeClass('hide');
          $this.addClass('hide');
        }
      });
    };

    $.fn.remove_product = function (product_data) {
      var add_to_cart_text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var $this = $(this);
      $.ajax({
        url: cartify_compare.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_compare_update_cookie'),
        type: 'POST',
        data: product_data,
        success: function success(response) {
          console.log(response);

          if (add_to_cart_text !== '') {
            $this.addClass('add-to-compare').removeClass('added-to-compare').html(add_to_cart_text);
            $('.compare-products-list').html(response);
          }

          if (product_data.reload) {
            location.reload();
          }
        }
      });
    };

    var urlParams = new URLSearchParams(window.location.search);
    var addToCompareParam = urlParams.get('add_to_compare');
    var removeFromCompareParam = urlParams.get('remove_item');
    $('.agni-add-to-compare').each(function () {
      var $this = $(this);
      var compare_button = $this.find('.agni-add-to-compare__button .add-to-compare'),
          remove_compare_button = $this.find('.agni-add-to-compare__button .added-to-compare'),
          add_to_cart_text = cartify_compare.add_to_compare_text,
          remove_from_compare_text = cartify_compare.remove_from_compare_text,
          product_id = compare_button.data('product-id'),
          product_remove_id = remove_compare_button.data('product-id');
      var product_data = {
        product_id: product_id
      };
      var product_remove_data = {
        product_id: product_remove_id
      };

      if (addToCompareParam) {
        product_data['product_id'] = addToCompareParam;
        compare_button.add_to_compare(product_data, remove_from_compare_text);
      }

      if (removeFromCompareParam) {
        product_remove_data['product_id'] = removeFromCompareParam;
        remove_compare_button.remove_product(product_remove_data, remove_from_compare_text);
      }
    });
    $(document).on('click', '.agni-add-to-compare__button .add-to-compare', function (e) {
      e.preventDefault();
      var remove_from_compare_text = cartify_compare.remove_from_compare_text,
          product_id = $(this).data('product-id');
      var product_data = {
        product_id: product_id
      };
      $(this).add_to_compare(product_data, remove_from_compare_text);
    });
    $(document).on('click', '.agni-add-to-compare__button .added-to-compare:not(.disabled)', function (e) {
      e.preventDefault();
      var add_to_cart_text = cartify_compare.add_to_compare_text,
          product_remove_id = $(this).data('product-id');
      var product_remove_data = {
        product_id: product_remove_id
      };
      $(this).add_to_compare(product_remove_data, add_to_cart_text);
    });
    $(document).on('click', '.agni-compare-clear', function (e) {
      e.preventDefault();
      $.ajax({
        url: cartify_compare.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_compare_clear_cookie'),
        type: 'POST',
        success: function success(response) {
          console.log(response);
          location.reload();
        }
      });
    });
    $('.agni-compare-product-remove').on('click', function (e) {
      e.preventDefault();
      var $this = $(this);
      var product_remove_id = $this.data('remove-id');
      var product_remove_data = {
        product_id: product_remove_id,
        reload: true
      };
      $this.remove_product(product_remove_data);
    });
  });
})(jQuery);