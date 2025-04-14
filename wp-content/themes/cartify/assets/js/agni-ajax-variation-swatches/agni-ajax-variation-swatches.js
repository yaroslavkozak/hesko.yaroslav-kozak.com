"use strict";

(function ($) {
  'use strict';

  $(document).on('click', 'form.variations_form .agni-swatch', function (e) {
    e.preventDefault();
    var $this = $(this),
        variation = $this.closest('tr'),
        swatches = $this.closest('.value').find('.agni-swatches'),
        swatch = $this.closest('.value').find('.agni-swatch'),
        select = $this.closest('.value').find('select'),
        value = $this.data('value'),
        label = $this.text();
    var valueClass = 'attribute-value';
    select.trigger('focusin');

    if (!$this.hasClass('selected')) {
      swatch.removeClass('selected');
      select.val('');
      $this.addClass('selected');
      select.val(value);
    } else {
      swatch.removeClass('selected');
      select.val('');
    }

    if (!variation.find('.' + valueClass).length) {
      variation.find('.label').append("<span class=" + valueClass + "></span>");
    }

    variation.find('.' + valueClass).html(label);
    select.change();
  }).on('click', 'form.variations_form .reset_variations', function () {
    $(this).closest('.variations_form').find('.agni-swatch.selected').removeClass('selected');
    $(this).closest('.variations_form').find('.attribute-value').remove();
  });
})(jQuery);