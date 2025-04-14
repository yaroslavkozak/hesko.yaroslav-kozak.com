!(function ($) {
    'use strict';

    $(document).ready(function () {


        $.agni_builder_frontend_products_processing_display_options = function (product_data, response) {

            response = $(response).wrap('<ul />').parent();

            if (product_data.product_title == false) {
                response.find('.woocommerce-loop-product__title').remove();
            }
            if (typeof product_data.product_desc == 'undefined' || product_data.product_desc == false) {
                response.find('.woocommerce-loop-product__description').remove();
            }
            if (product_data.product_category == false) {
                response.find('.woocommerce-loop-product__category').remove();
            }
            if (product_data.product_price == false) {
                response.find('.price').remove();
            }
            if (product_data.product_rating == false) {
                response.find('.woocommerce-product-rating').remove();
            }
            if (product_data.product_stock == false) {
                response.find('.agni-stock-indicator').remove();
            }
            if (product_data.product_countdown == false) {
                response.find('.agni-sale-countdown').remove();
            }
            if (product_data.product_add_to_cart == false) {
                response.find('.agni-add-to-cart').remove();
            }
            if (product_data.product_add_to_compare == false) {
                response.find('.agni-add-to-compare').remove();
            }
            if (product_data.product_quickview == false) {
                response.find('.agni-quickview').remove();
            }
            if (product_data.product_qty == false) {
                response.find('.agni-update-cart').remove();
            }

            response = response.children()

            return response;

        }

        $.agni_builder_frontend_products_categories_processing_display_options = function (product_data, response) {
            response = $(response).wrap('<ul />').parent();

            if (product_data.category_title == false) {
                response.find('.woocommerce-loop-category__title').remove();
            }
            if (product_data.category_desc == false) {
                response.find('.woocommerce-loop-category__description').remove();
            }
            if (product_data.category_count == false) {
                response.find('.woocommerce-loop-category__title .count').remove();
            }


            response = response.children()

            return response;
        }

        $.agni_builder_frontend_products_tab = function ($this, product_data) {

            // console.log("Product data:", product_data);

            $.ajax({
                url: agni_builder_frontend.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_builder_products_tab_contents'),
                type: 'POST',
                data: product_data,
                dataType: 'json',
                success: function (response) {
                    // console.log(response);
                    if (!response.success) {
                        return;
                    }

                    var newContent = $.agni_builder_frontend_products_processing_display_options(product_data, response['data']['content']);

                    $this.find('.agni-block-products-tab-contents > ul').html(newContent);
                    // $this.find('.agni-block-products-tab-header').append(response['data']['pagination']);
                    $(response['data']['pagination']).insertBefore($this.find('.agni-block-products-tab-btn'));


                    $this.find('.agni-products-carousel').each(function () {
                        $(this).slick('unslick');
                        $.agni_products_carousel($(this));
                    })

                    // Agni sale countdown
                    $('.agni-sale-countdown').each(function () {
                        $.agni_sale_countdown.init($(this));
                    })

                    // WooCommerce archives thumbnail slider
                    $('.woocommerce-loop-product__thumbnail').not('.slick-initialized').each(function () {
                        var $this = $(this);
                        if ($this.hasClass('style-3') && $this.children().length > 1) {
                            $.agni_scripts.archives_gallery_slider($this);
                        }
                    })


                    // $this.find('.has-inline-products').each(function () {
                    //     if ($(this).hasClass('slick-initialized')) {
                    //         $(this).slick('unslick');
                    //     }
                    //     $.agni_inline_products_carousel($(this));
                    // })

                    if ($this.hasClass('has-scroll-navigation-mobile')) {
                        var content = $this.find('.agni-block-products-tab-contents>ul'),
                            nav = $this.find('.agni-block-products-tab-nav');
                        $.agni_inline_products_scroll(content, nav);
                    }



                    if (typeof wc_add_to_cart_variation_params !== 'undefined') {
                        $('.variations_form').each(function () {
                            $(this).wc_variation_form();
                        });
                    }

                }

            })

        }

        $.agni_builder_frontend_products_categories_tab = function ($this, product_data) {

            // console.log(product_data); // JSON.stringify JSON.parse(product_data)
            $.ajax({
                url: agni_builder_frontend.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_builder_products_categories_tab_contents'),
                type: 'POST',
                data: product_data,
                dataType: 'json',
                success: function (response) {
                    console.log(response);
                    if (!response.success) {
                        return;
                    }

                    var newContent = $.agni_builder_frontend_products_categories_processing_display_options(product_data, response['data']['content']);

                    $this.find('.agni-block-products-categories-tab-contents > ul').html(newContent);
                    $this.find('.agni-block-products-categories-tab-header').append(response['data']['pagination']);

                    $this.find('.agni-products-carousel').each(function () {
                        $(this).slick('unslick');
                        $.agni_products_carousel($(this));
                    })


                    // $this.find('.has-inline-categories').each(function () {
                    //     if ($(this).hasClass('slick-initialized')) {
                    //         $(this).slick('unslick');
                    //     }
                    //     $.agni_inline_products_carousel($(this));
                    // })

                    if ($this.hasClass('has-scroll-navigation-mobile')) {
                        var content = $this.find('.agni-block-products-categories-tab-contents>ul'),
                            nav = $this.find('.agni-block-products-categories-tab-nav');
                        $.agni_inline_products_scroll(content, nav);
                    }

                }
            })

        }

        $.agni_builder_frontend_products_ajax_pagination = function ($this, product_data, paginationArgs = {}, append = false) {

            $.ajax({
                url: agni_builder_frontend.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_builder_ajax_get_products'),
                type: 'POST',
                data: product_data,
                success: function (response) {
                    // console.log(response);
                    if (!response) {
                        return;
                    }

                    response = $.agni_builder_frontend_products_processing_display_options(product_data, response);


                    if (!append) {
                        $this.find(' > ul').html(response);
                    }
                    else {
                        $this.find(' > ul').append(response);
                    }

                    if (!$.isEmptyObject(paginationArgs)) {
                        var { isPagination, navSelector, loadMoreSelector, prevNavSelector, nextNavSelector, pagination, currentPageNum, totalPageNum, totalProducts } = paginationArgs
                        var newPageNum = currentPageNum;
                        if (navSelector.hasClass(loadMoreSelector) || navSelector.hasClass(nextNavSelector)) {
                            if (totalPageNum == (currentPageNum + 1)) {
                                if (!isPagination) {
                                    pagination.remove();
                                }
                                newPageNum = currentPageNum + 1;
                            }
                            else {
                                newPageNum = currentPageNum + 1;

                            }
                        }
                        else if (navSelector.hasClass(prevNavSelector)) {
                            newPageNum = currentPageNum - 1
                        }

                        pagination.attr('data-current-page-num', newPageNum);

                        if (isPagination) {
                            (newPageNum != '1') ? pagination.find('.' + prevNavSelector).removeClass('disabled') : pagination.find('.' + prevNavSelector).addClass('disabled');

                            (newPageNum != totalPageNum) ? pagination.find('.' + nextNavSelector).removeClass('disabled') : pagination.find('.' + nextNavSelector).addClass('disabled');
                        }
                    }

                    // Agni sale countdown
                    $('.agni-sale-countdown').each(function () {
                        $.agni_sale_countdown.init($(this));
                    })

                    // WooCommerce archives thumbnail slider
                    $('.woocommerce-loop-product__thumbnail').not('.slick-initialized').each(function () {
                        var $this = $(this);
                        if ($this.hasClass('style-3') && $this.children().length > 1) {
                            $.agni_scripts.archives_gallery_slider($this);
                        }
                    })

                    if (typeof wc_add_to_cart_variation_params !== 'undefined') {
                        $('.variations_form').each(function () {
                            $(this).wc_variation_form();
                        });
                    }


                }
            })

        }

        $('.agni-block-products').each(function () {
            var $this = $(this),
                contents = $this.find('.agni-block-products-contents'),
                pagination = $this.find('.agni-block-products-pagination'),
                navBtn = pagination.find('.agni-block-products-pagination__nav'),
                loadMoreSelector = 'load-more',
                prevNavSelector = 'nav-prev',
                nextNavSelector = 'nav-next';
            var breakpoints = agni_builder_frontend.breakpoints;

            var product_data = pagination.data('args');
            var current_page_num = pagination.attr('data-current-page-num');
            var total_page_num = pagination.data('total-page-num');
            var total_products = pagination.data('total-products');

            var currentDevice = 'mobile';
            var countUpdated = false;

            if (pagination.length !== 0) {

                var products_count_mobile = product_data['columns'][currentDevice] * product_data['rows'][currentDevice];

                if ((breakpoints['tab'] < window.innerWidth && window.innerWidth < breakpoints['laptop'])) {
                    currentDevice = 'tab';
                    if ((product_data['columns'][currentDevice] * product_data['rows'][currentDevice]) !== (products_count_mobile)) {
                        countUpdated = true;
                    }
                }
                else if ((breakpoints['laptop'] < window.innerWidth && window.innerWidth < breakpoints['desktop'])) {
                    currentDevice = 'laptop';
                    if ((product_data['columns'][currentDevice] * product_data['rows'][currentDevice]) !== (products_count_mobile)) {
                        countUpdated = true;
                    }
                }
                else if ((breakpoints['desktop'] < window.innerWidth)) {
                    currentDevice = 'desktop';
                    if ((product_data['columns'][currentDevice] * product_data['rows'][currentDevice]) !== (products_count_mobile)) {
                        countUpdated = true;
                    }
                }


                if (!product_data['productsSynced']) {
                    countUpdated = false;
                }

                var currentDeviceTotalPageNum = total_page_num[currentDevice];

                if (currentDevice !== 'mobile' && countUpdated) {

                    var product_count_on_grid = product_data['columns'][currentDevice] * product_data['rows'][currentDevice];

                    product_data['count'] = (total_products < product_count_on_grid) ? total_products : product_count_on_grid;

                    $.agni_builder_frontend_products_ajax_pagination(contents, product_data);
                }

                if (current_page_num == '1') {
                    pagination.find('.' + prevNavSelector).addClass('disabled');
                }

                if (current_page_num == currentDeviceTotalPageNum) {
                    pagination.find('.' + nextNavSelector).addClass('disabled');
                }

            }

        })

        $(document).on('click', '.agni-block-products-pagination__nav', function () {
            var thisNavBtn = $(this);
            var $this = thisNavBtn.closest('.agni-block-products, .agni-block-products-tab');
            var pagination = thisNavBtn.closest('.agni-block-products-pagination');

            var contents = $this.hasClass('agni-block-products-tab') ? $this.find('.agni-block-products-tab-contents') : $this.find('.agni-block-products-contents');

            var loadMoreSelector = 'load-more',
                prevNavSelector = 'nav-prev',
                nextNavSelector = 'nav-next';

            var breakpoints = agni_builder_frontend.breakpoints;

            var product_data = pagination.data('args');
            // var current_page_num = pagination.attr('data-current-page-num');
            var total_page_num = pagination.data('total-page-num');
            var total_products = pagination.data('total-products');


            if (thisNavBtn.hasClass('disabled')) {
                return null;
            }

            var currentPageNum = pagination.attr('data-current-page-num');


            var paginationArray = {
                'desktop': pagination.hasClass('has-pagination-desktop'),
                'laptop': pagination.hasClass('has-pagination-laptop'),
                'tab': pagination.hasClass('has-pagination-tab'),
                'mobile': pagination.hasClass('has-pagination-mobile')
            };

            var currentDevice = 'mobile';
            if (typeof breakpoints !== 'undefined') {

                if ((breakpoints['tab'] < window.innerWidth && window.innerWidth < breakpoints['laptop'])) {
                    currentDevice = 'tab';
                }
                else if ((breakpoints['laptop'] < window.innerWidth && window.innerWidth < breakpoints['desktop'])) {
                    currentDevice = 'laptop';
                }
                else if ((breakpoints['desktop'] < window.innerWidth)) {
                    currentDevice = 'desktop';
                }
            }

            var currentDeviceTotalPageNum = total_page_num[currentDevice];

            if (paginationArray[currentDevice]) {

                var product_count_on_grid = product_data['columns'][currentDevice] * product_data['rows'][currentDevice];

                if (!product_data['productsSynced']) {
                    var product_count_on_grid = product_data['countOnGrid'];
                }

                product_data['count'] = product_count_on_grid;

                if (thisNavBtn.hasClass(loadMoreSelector) || thisNavBtn.hasClass(nextNavSelector)) {
                    if (currentPageNum == (currentDeviceTotalPageNum - 1)) {
                        product_data['count'] = total_products - (product_count_on_grid * parseInt(currentPageNum));
                    }

                    product_data['offset'] = product_count_on_grid * parseInt(currentPageNum);
                }
                else if (thisNavBtn.hasClass(prevNavSelector)) {
                    product_data['offset'] = 0;
                    if (currentPageNum > '2') {
                        product_data['offset'] = product_count_on_grid * (parseInt(currentPageNum) - 2);
                    }
                }
                var append = false;
                if (thisNavBtn.hasClass(loadMoreSelector)) {
                    append = true;
                }


                var paginationArgs = {
                    isPagination: !append,
                    navSelector: thisNavBtn,
                    loadMoreSelector: loadMoreSelector,
                    prevNavSelector: prevNavSelector,
                    nextNavSelector: nextNavSelector,
                    currentPageNum: parseInt(currentPageNum),
                    totalPageNum: currentDeviceTotalPageNum,
                    totalProducts: total_products,
                    pagination: pagination,
                }

                $.agni_builder_frontend_products_ajax_pagination(contents, product_data, paginationArgs, append);

            }
        })

        $('.agni-block-products-tab').each(function () {
            var $this = $(this),
                product_tabs = $this.find('li');

            product_tabs.each(function () {
                var product_tab = $(this);

                var breakpoints = agni_builder_frontend.breakpoints;
                var product_data = product_tab.data('args');

                var currentDevice = 'mobile';

                // if (product_tab.hasClass('active')) {

                //     // if (typeof breakpoints !== 'undefined') {

                //     if ((breakpoints['tab'] < window.innerWidth && window.innerWidth < breakpoints['laptop'])) {
                //         currentDevice = 'tab';
                //     }
                //     else if ((breakpoints['laptop'] < window.innerWidth && window.innerWidth < breakpoints['desktop'])) {
                //         currentDevice = 'laptop';
                //     }
                //     else if ((breakpoints['desktop'] < window.innerWidth)) {
                //         currentDevice = 'desktop';
                //     }

                //     product_data['totalProducts'] = product_data['count'];

                //     if (typeof product_data['carousel'] !== 'undefined' && !product_data['carousel']) {
                //         var product_count_on_grid = product_data['columns'][currentDevice] * product_data['rows'][currentDevice];

                //         if (!product_data['productsSynced']) {
                //             var product_count_on_grid = product_data['countOnGrid'];
                //         }

                //         product_data['count'] = product_count_on_grid;
                //     }

                //     $.agni_builder_frontend_products_tab($this, product_data);
                // }

                product_tab.on('click', function () {
                    // var product_tab = $(this);
                    product_tabs.removeClass('active');
                    product_tab.addClass('active');

                    if ((breakpoints['tab'] < window.innerWidth && window.innerWidth < breakpoints['laptop'])) {
                        currentDevice = 'tab';
                    }
                    else if ((breakpoints['laptop'] < window.innerWidth && window.innerWidth < breakpoints['desktop'])) {
                        currentDevice = 'laptop';
                    }
                    else if ((breakpoints['desktop'] < window.innerWidth)) {
                        currentDevice = 'desktop';
                    }

                    product_data['totalProducts'] = product_data['count'];

                    if (typeof product_data['carousel'] !== 'undefined' && !product_data['carousel']) {
                        var product_count_on_grid = product_data['columns'][currentDevice] * product_data['rows'][currentDevice];

                        product_data['count'] = product_count_on_grid;
                    }

                    $.agni_builder_frontend_products_tab($this, product_data);
                })
            })

        })




        $.agni_builder_frontend_products_categories_ajax_pagination = function ($this, product_data, paginationArgs = {}, append = false) {

            // product_data['action'] = 'agni_builder_ajax_get_products_categories';

            $.ajax({
                url: agni_builder_frontend.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_builder_ajax_get_products_categories'),
                // url: agni_builder_frontend.ajaxurl,
                type: 'POST',
                data: product_data,
                success: function (response) {
                    // console.log("res", response);
                    if (!response) {
                        return;
                    }

                    response = $.agni_builder_frontend_products_categories_processing_display_options(product_data, response);


                    if (!append) {
                        $this.find(' > ul').html(response);
                    }
                    else {
                        $this.find(' > ul').append(response);
                    }

                    if (!$.isEmptyObject(paginationArgs)) {
                        var { isPagination, navSelector, loadMoreSelector, prevNavSelector, nextNavSelector, pagination, currentPageNum, totalPageNum, totalProducts } = paginationArgs
                        var newPageNum = currentPageNum;
                        if (navSelector.hasClass(loadMoreSelector) || navSelector.hasClass(nextNavSelector)) {
                            if (totalPageNum == (currentPageNum + 1)) {
                                if (!isPagination) {
                                    pagination.remove();
                                }
                                newPageNum = currentPageNum + 1;
                            }
                            else {
                                newPageNum = currentPageNum + 1;

                            }
                        }
                        else if (navSelector.hasClass(prevNavSelector)) {
                            newPageNum = currentPageNum - 1
                        }

                        pagination.attr('data-current-page-num', newPageNum);

                        if (isPagination) {
                            (newPageNum != '1') ? pagination.find('.' + prevNavSelector).removeClass('disabled') : pagination.find('.' + prevNavSelector).addClass('disabled');

                            (newPageNum != totalPageNum) ? pagination.find('.' + nextNavSelector).removeClass('disabled') : pagination.find('.' + nextNavSelector).addClass('disabled');
                        }
                    }

                    // Agni sale countdown
                    $('.agni-sale-countdown').each(function () {
                        $.agni_sale_countdown.init($(this));
                    })

                    // WooCommerce archives thumbnail slider
                    $('.woocommerce-loop-product__thumbnail').not('.slick-initialized').each(function () {
                        var $this = $(this);
                        if ($this.hasClass('style-3') && $this.children().length > 1) {
                            $.agni_scripts.archives_gallery_slider($this);
                        }
                    })

                    if (typeof wc_add_to_cart_variation_params !== 'undefined') {
                        $('.variations_form').each(function () {
                            $(this).wc_variation_form();
                        });
                    }


                }
            })

        }

        $('.agni-block-products-categories').each(function () {
            var $this = $(this),
                contents = $this.find('.agni-block-products-categories-contents'),
                pagination = $this.find('.agni-block-products-categories-pagination'),
                navBtn = pagination.find('.agni-block-products-categories-pagination__nav'),
                loadMoreSelector = 'load-more',
                prevNavSelector = 'nav-prev',
                nextNavSelector = 'nav-next';
            var breakpoints = agni_builder_frontend.breakpoints;

            var product_data = pagination.data('args');
            var current_page_num = pagination.attr('data-current-page-num');
            var total_page_num = pagination.data('total-page-num');
            var total_products = pagination.data('total-products');

            var currentDevice = 'mobile';
            var countUpdated = false;

            if (pagination.length !== 0) {

                var products_count_mobile = product_data['columns'][currentDevice] * product_data['rows'][currentDevice];

                if ((breakpoints['tab'] < window.innerWidth && window.innerWidth < breakpoints['laptop'])) {
                    currentDevice = 'tab';
                    if ((product_data['columns'][currentDevice] * product_data['rows'][currentDevice]) !== (products_count_mobile)) {
                        countUpdated = true;
                    }
                }
                else if ((breakpoints['laptop'] < window.innerWidth && window.innerWidth < breakpoints['desktop'])) {
                    currentDevice = 'laptop';
                    if ((product_data['columns'][currentDevice] * product_data['rows'][currentDevice]) !== (products_count_mobile)) {
                        countUpdated = true;
                    }
                }
                else if ((breakpoints['desktop'] < window.innerWidth)) {
                    currentDevice = 'desktop';
                    if ((product_data['columns'][currentDevice] * product_data['rows'][currentDevice]) !== (products_count_mobile)) {
                        countUpdated = true;
                    }
                }

                if (!product_data['categoriesSynced']) {
                    countUpdated = false;
                }

                var currentDeviceTotalPageNum = total_page_num[currentDevice];

                if (currentDevice !== 'mobile' && countUpdated) {

                    var product_count_on_grid = product_data['columns'][currentDevice] * product_data['rows'][currentDevice];

                    product_data['count'] = (total_products < product_count_on_grid) ? total_products : product_count_on_grid;

                    $.agni_builder_frontend_products_categories_ajax_pagination(contents, product_data);
                }

                if (current_page_num == '1') {
                    pagination.find('.' + prevNavSelector).addClass('disabled');
                }

                if (current_page_num == currentDeviceTotalPageNum) {
                    pagination.find('.' + nextNavSelector).addClass('disabled');
                }

            }

        })

        $(document).on('click', '.agni-block-products-categories-pagination__nav', function () {
            var thisNavBtn = $(this);
            var $this = thisNavBtn.closest('.agni-block-products-categories, .agni-block-products-categories-tab');
            var pagination = thisNavBtn.closest('.agni-block-products-categories-pagination');

            var contents = $this.hasClass('agni-block-products-categories-tab') ? $this.find('.agni-block-products-categories-tab-contents') : $this.find('.agni-block-products-categories-contents');

            var loadMoreSelector = 'load-more',
                prevNavSelector = 'nav-prev',
                nextNavSelector = 'nav-next';

            var breakpoints = agni_builder_frontend.breakpoints;

            var product_data = pagination.data('args');
            // var current_page_num = pagination.attr('data-current-page-num');
            var total_page_num = pagination.data('total-page-num');
            var total_products = pagination.data('total-products');


            if (thisNavBtn.hasClass('disabled')) {
                return null;
            }

            var currentPageNum = pagination.attr('data-current-page-num');


            var paginationArray = {
                'desktop': pagination.hasClass('has-pagination-desktop'),
                'laptop': pagination.hasClass('has-pagination-laptop'),
                'tab': pagination.hasClass('has-pagination-tab'),
                'mobile': pagination.hasClass('has-pagination-mobile')
            };

            var currentDevice = 'mobile';
            if (typeof breakpoints !== 'undefined') {

                if ((breakpoints['tab'] < window.innerWidth && window.innerWidth < breakpoints['laptop'])) {
                    currentDevice = 'tab';
                }
                else if ((breakpoints['laptop'] < window.innerWidth && window.innerWidth < breakpoints['desktop'])) {
                    currentDevice = 'laptop';
                }
                else if ((breakpoints['desktop'] < window.innerWidth)) {
                    currentDevice = 'desktop';
                }
            }

            // console.log("current device", currentDevice);
            var currentDeviceTotalPageNum = total_page_num[currentDevice];

            if (paginationArray[currentDevice]) {

                var product_count_on_grid = product_data['columns'][currentDevice] * product_data['rows'][currentDevice];

                if (!product_data['categoriesSynced']) {
                    var product_count_on_grid = product_data['countOnGrid'];
                }

                product_data['count'] = product_count_on_grid;

                if (thisNavBtn.hasClass(loadMoreSelector) || thisNavBtn.hasClass(nextNavSelector)) {
                    if (currentPageNum == (currentDeviceTotalPageNum - 1)) {
                        product_data['count'] = total_products - (product_count_on_grid * parseInt(currentPageNum));
                    }

                    product_data['offset'] = product_count_on_grid * parseInt(currentPageNum);
                }
                else if (thisNavBtn.hasClass(prevNavSelector)) {
                    product_data['offset'] = 0;
                    if (currentPageNum > '2') {
                        product_data['offset'] = product_count_on_grid * (parseInt(currentPageNum) - 2);
                    }
                }
                var append = false;
                if (thisNavBtn.hasClass(loadMoreSelector)) {
                    append = true;
                }


                var paginationArgs = {
                    isPagination: !append,
                    navSelector: thisNavBtn,
                    loadMoreSelector: loadMoreSelector,
                    prevNavSelector: prevNavSelector,
                    nextNavSelector: nextNavSelector,
                    currentPageNum: parseInt(currentPageNum),
                    totalPageNum: currentDeviceTotalPageNum,
                    totalProducts: total_products,
                    pagination: pagination,
                }

                $.agni_builder_frontend_products_categories_ajax_pagination(contents, product_data, paginationArgs, append);

            }
        })


        $('.agni-block-products-categories-tab').each(function () {
            var $this = $(this),
                product_tabs = $this.find('li');

            product_tabs.each(function () {
                var product_tab = $(this);

                var breakpoints = agni_builder_frontend.breakpoints;
                var product_data = product_tab.data('args');

                var currentDevice = 'mobile';

                // if (product_tab.hasClass('active')) {

                //     // if (typeof breakpoints !== 'undefined') {

                //     if ((breakpoints['tab'] < window.innerWidth && window.innerWidth < breakpoints['laptop'])) {
                //         currentDevice = 'tab';
                //     }
                //     else if ((breakpoints['laptop'] < window.innerWidth && window.innerWidth < breakpoints['desktop'])) {
                //         currentDevice = 'laptop';
                //     }
                //     else if ((breakpoints['desktop'] < window.innerWidth)) {
                //         currentDevice = 'desktop';
                //     }

                //     product_data['totalProducts'] = product_data['count'];

                //     if (typeof product_data['carousel'] !== 'undefined' && !product_data['carousel']) {
                //         var product_count_on_grid = product_data['columns'][currentDevice] * product_data['rows'][currentDevice];

                //         if (!product_data['categoriesSynced']) {
                //             var product_count_on_grid = product_data['countOnGrid'];
                //         }

                //         product_data['count'] = product_count_on_grid;
                //     }

                //     $.agni_builder_frontend_products_categories_tab($this, product_data);
                // }

                product_tab.on('click', function () {
                    // var product_tab = $(this);
                    product_tabs.removeClass('active');
                    product_tab.addClass('active');

                    if ((breakpoints['tab'] < window.innerWidth && window.innerWidth < breakpoints['laptop'])) {
                        currentDevice = 'tab';
                    }
                    else if ((breakpoints['laptop'] < window.innerWidth && window.innerWidth < breakpoints['desktop'])) {
                        currentDevice = 'laptop';
                    }
                    else if ((breakpoints['desktop'] < window.innerWidth)) {
                        currentDevice = 'desktop';
                    }

                    product_data['totalProducts'] = product_data['count'];

                    if (typeof product_data['carousel'] !== 'undefined' && !product_data['carousel']) {
                        var product_count_on_grid = product_data['columns'][currentDevice] * product_data['rows'][currentDevice];

                        product_data['count'] = product_count_on_grid;
                    }

                    $.agni_builder_frontend_products_categories_tab($this, product_data);
                })
            })


        })


        $.agni_products_carousel = function ($this) {

            // $($this.clone()).insertAfter($this);

            // $this.slick({
            //     slidesToShow: 4
            // })

            var breakpoints = agni_builder_frontend.breakpoints;

            var slidesToShowArray = $this.data('slick-slides-to-show');
            var slidesPerRowArray = $this.data('slick-slides-per-row');


            var responsive = [];
            var slidesToShow = '';
            var slidesPerRow = '';


            Object.entries(breakpoints).forEach(function ([device, value]) {

                if (device !== 'mobile') {
                    responsive.push({
                        breakpoint: parseInt(value),
                        settings: {
                            slidesToShow: parseInt(slidesToShowArray[device]),
                            slidesPerRow: parseInt(slidesPerRowArray[device])
                        }
                    })
                }
                else {
                    slidesToShow = parseInt(slidesToShowArray[device]);
                    slidesPerRow = parseInt(slidesPerRowArray[device]);
                }
            });


            $this.slick({
                slidesToShow: slidesToShow,
                slidesPerRow: slidesPerRow,
                responsive: responsive,
                mobileFirst: true,
                nextArrow: '<span class="slick-next slick-arrow"><i class="lni lni-chevron-right"></i></span>',
                prevArrow: '<span class="slick-prev slick-arrow"><i class="lni lni-chevron-left"></i></span>',
                rtl: (document.dir === 'rtl')
            })
        }


        $('.agni-products-carousel').each(function () {
            $.agni_products_carousel($(this));
        })



        // $.agni_inline_products_carousel = function ($this) {

        //     var breakpoints = agni_builder_frontend.breakpoints;

        //     Object.entries(breakpoints).forEach(function ([device, value]) {

        //         if (device == 'tab') {
        //             if ($(window).width() < parseInt(value)) {

        //                 $this.slick({
        //                     dots: false,
        //                     // // infinite: false,
        //                     speed: 300,
        //                     slidesToShow: 2,
        //                     slidesToScroll: 1,
        //                     centerMode: true,
        //                     centerPadding: '20px',
        //                     initialSlide: 1,
        //                     nextArrow: '<span class="slick-next slick-arrow"><i class="lni lni-chevron-right"></i></span>',
        //                     prevArrow: '<span class="slick-prev slick-arrow"><i class="lni lni-chevron-left"></i></span>',
        //                 });
        //             }
        //         }
        //     });
        // }


        $.agni_inline_products_scroll = (content, nav) => {
            var $this = $(this);

            var breakpoints = agni_builder_frontend.breakpoints;

            Object.entries(breakpoints).forEach(function ([device, value]) {

                if (device == 'tab') {
                    if ($(window).width() < parseInt(value)) {

                        var $table = content;
                        var scrollMaxLeft = parseInt($table.innerWidth() - $table.parent().innerWidth()) * -1;

                        // console.log("scroll max left", scrollMaxLeft, scrollMaxLeft == 0);

                        if (scrollMaxLeft != 0) {

                            var leftTimeout, rightTimeout;
                            var left = nav.find('.nav-left');
                            var right = nav.find('.nav-right');

                            nav.removeClass('hide');

                            function scrollLeft() {
                                var positionLeft = parseInt($table.css('left').split('px')[0]);

                                if (positionLeft < 0 && (positionLeft + 5) >= scrollMaxLeft) {
                                    $table.css('left', parseInt($table.css('left').split('px')[0]) + 5);
                                }
                                // console.log("left", $table.css('left'), parseInt($table.css('left').split('px')[0]) + 5);
                                // console.log("table width", $table.innerWidth());
                                // console.log("table container width", $table.parent().innerWidth());
                            }

                            function scrollRight() {
                                var positionLeft = parseInt($table.css('left').split('px')[0]);
                                if (positionLeft <= 0 && (positionLeft - 5) > scrollMaxLeft) {
                                    $table.css('left', (parseInt($table.css('left').split('px')[0]) - 5));
                                }
                                // console.log("left right", $table.css('left'), parseInt($table.css('left').split('px')[0]) - 5);
                                // console.log("table width", $table.innerWidth());
                                // console.log("table container width", $table.parent().innerWidth());
                            }


                            var scrollStartLeft = function (e) {
                                var mouseClick = e.which;
                                var eventType = e.type;
                                if (mouseClick == '1' || eventType == 'touchstart') {
                                    scrollLeft();
                                    leftTimeout = setInterval(function () {
                                        scrollLeft();
                                    }, 5);

                                }

                                return false;
                            }

                            var scrollStartRight = function (e) {

                                var mouseClick = e.which;
                                var eventType = e.type;
                                if (mouseClick == '1' || eventType == 'touchstart') {
                                    scrollRight();
                                    leftTimeout = setInterval(function () {
                                        scrollRight();
                                    }, 5);

                                }

                                return false;
                            };

                            var scrollStop = function (e) {
                                // if (e.cancelable) {
                                //     e.preventDefault();
                                // }
                                // console.log("triggered", e.type)
                                clearInterval(rightTimeout);
                                clearInterval(leftTimeout);
                                return false;
                            };


                            left.on('mousedown touchstart', scrollStartLeft);
                            right.on('mousedown touchstart', scrollStartRight);

                            $(document).on('mouseup', scrollStop);
                            right.on('touchend', scrollStop);
                            left.on('touchend', scrollStop);
                            // $(document).on('touchcancel', scrollStop);
                            // $(document).on('touchleave', scrollStop);
                        }

                        // $this.slick({
                        //     dots: false,
                        //     // // infinite: false,
                        //     speed: 300,
                        //     slidesToShow: 2,
                        //     slidesToScroll: 1,
                        //     centerMode: true,
                        //     centerPadding: '20px',
                        //     initialSlide: 1,
                        //     nextArrow: '<span class="slick-next slick-arrow"><i class="lni lni-chevron-right"></i></span>',
                        //     prevArrow: '<span class="slick-prev slick-arrow"><i class="lni lni-chevron-left"></i></span>',
                        // });
                    }
                }
            });
        }

        $('.agni-block-products').each(function () {
            // var products = $(this).find('.has-inline-products');
            // $.agni_inline_products_carousel(products);
            var $this = $(this);
            if ($this.hasClass('has-scroll-navigation-mobile')) {
                var content = $this.find('.agni-block-products-contents>ul'),
                    nav = $this.find('.agni-block-products-nav');

                $.agni_inline_products_scroll(content, nav);
            }
        })

        $('.agni-block-products-categories').each(function () {
            // var products = $(this).find('.has-inline-categories');
            // $.agni_inline_products_carousel(products);
            var $this = $(this);
            if ($this.hasClass('has-scroll-navigation-mobile')) {
                var content = $this.find('.agni-block-products-categories-contents>ul'),
                    nav = $this.find('.agni-block-products-categories-nav');

                $.agni_inline_products_scroll(content, nav);
            }
        })

        $.agni_woocommerce_product_photoswipe = {
            product_gallery_lightbox: function ($this) {
                //var product_gallery = $('.woocommerce-product-gallery');

                $this.photoswipeimage({
                    getThumbBoundsFn: function () {
                        return false;
                    },
                    bgOpacity: 1,
                    loop: true,
                    shareEl: false,
                    //thumb: true, //added by agnihd
                });

            },

            photoswipe_wrapper: function () {

                var $pswp_wrapper = '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar pswp--svg"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button><button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button><button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"> </button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"> </button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>';
                $('body').append($pswp_wrapper);
            }
        }

        $('.agni-block-gallery').each(function () {
            var $this = $(this);

            if ($this.hasClass('has-lightbox')) {

                $.agni_woocommerce_product_photoswipe.photoswipe_wrapper();
                $.agni_woocommerce_product_photoswipe.product_gallery_lightbox($this.find('ul'));

            }

        })

        $.fn.agni_block_carousel = function () {
            var $this = $(this);
            var breakpoints = agni_builder_frontend.breakpoints;

            var slidesToShowArray = $this.data('slick-slides-to-show');
            var slickOptions = JSON.parse(JSON.parse($this.data('slick')));

            var responsive = [];
            var slidesToShow = '';

            var options = {
                mobileFirst: true,
                adaptiveHeight: true,
                nextArrow: '<span class="slick-next slick-arrow"><i class="lni lni-chevron-right"></i></span>',
                prevArrow: '<span class="slick-prev slick-arrow"><i class="lni lni-chevron-left"></i></span>',
            }

            if (typeof slidesToShowArray != 'undefined') {
                Object.entries(breakpoints).forEach(function ([device, value]) {

                    if (device !== 'mobile') {
                        responsive.push({
                            breakpoint: parseInt(value),
                            settings: {
                                slidesToShow: parseInt(slidesToShowArray[device]),
                            }
                        })
                    }
                    else {
                        slidesToShow = parseInt(slidesToShowArray[device]);
                    }
                });

                options['slidesToShow'] = slidesToShow;
                options['responsive'] = responsive;
            }
            options = $.extend(options, slickOptions);
            // console.log("slick options, ", options);

            options['rtl'] = (document.dir === 'rtl'); // Adding RTL support

            $this.slick(options);
        }

        $('.agni-block-has-carousel').each(function () {
            $(this).agni_block_carousel();
        })


        if ($('.agni-block-instagram').length !== 0) {
            var instagramWrapper = $('.agni-block-instagram');
            var access_token = agni_builder_frontend.instagram_token;

            if (!access_token) {
                instagramWrapper.html('No access token found. Make sure that you\'ve added at "Appearance->Customize->Cartify Theme Options->API Keys"');

                return null;
            }
            // console.log("instagram", instagramWrapper);
            // console.log("instagram api called");

            // instagramWrapper.each(function (insta) {
            //     console.log("each data", insta)
            // })

            var data = {
                fields: 'id, username',
                access_token
            };
            var mediaData = {
                fields: 'caption, id, media_type, media_url, permalink, thumbnail_url, username, timestamp',
                access_token
            }

            // var userData = [];

            var userData = $.ajax({
                type: 'GET',
                url: 'https://graph.instagram.com/me/media',
                data,
                dataType: 'json',
                async: false,
                success: function (res) {
                    // console.log("res", res);
                    var resData = res.data;
                    // userData = resData;
                    // var slicedRes = resData.slice(0, options.count)
                    // console.log("res data", resData);

                    return resData;

                },
                error: function (err) {
                    var response = JSON.parse(err.responseText)

                    instagramWrapper.html(response.error.message)
                }

            });

            var userJSONData = userData.responseJSON.data;
            var countsList = [];
            var captionsList = [];

            instagramWrapper.each(function () {
                var $this = $(this);
                var options = $this.data('options');

                captionsList.push(options.filterByCaption);
                countsList.push(options.count);
            })


            if (!userJSONData) {
                return null;
            }



            // console.log("user data", userData.responseJSON.data);
            // console.log("media countt", countsList, Math.max(...countsList));

            // var slicedUserJSONData = userJSONData.slice(0, Math.max(...countsList));
            var slicedUserJSONData = userJSONData;
            var totalCounts = 0;
            var instagramMedia = [];
            if (slicedUserJSONData) {
                // $this.prepend('<ul class="agni-block-instagram-items"></ul>');
                slicedUserJSONData.forEach(media => {

                    // var $li = $('<li/>');
                    // $this.find('ul').append($li);
                    if (totalCounts < Math.max(...countsList)) {

                        var mediaResData = $.ajax({
                            type: 'GET',
                            url: 'https://graph.instagram.com/' + media.id,
                            data: mediaData,
                            dataType: 'json',
                            async: false,
                            success: function (res) {
                                // console.log("sliced res", res);

                                var mediaCaption = res.caption;

                                var hasCaption = captionsList.some(function (caption) { return mediaCaption.indexOf(caption) >= 0; });
                                if (hasCaption) {
                                    // There's at least one
                                    totalCounts = totalCounts + 1;
                                }

                                return res.data;

                            }
                        });

                        instagramMedia.push(mediaResData.responseJSON);
                    }
                });



                instagramWrapper.each(function () {
                    var $this = $(this);
                    var $ul = $this.find('ul.agni-block-instagram-items');
                    var options = $this.data('options');

                    // var res = instagramMedia[index]
                    // if ($ul.hasClass('slick-initialized')) {
                    //     $ul.slick('unslick');
                    // }

                    var instagramMediaFilteredByCaption = instagramMedia.filter(function (media) {
                        if (options.filterByCaption && options.filterByCaption.length > 0) {
                            var mediaCaption = media.caption;
                            return mediaCaption.includes(options.filterByCaption);
                        }

                        return true;
                    })


                    var slicedArray = instagramMediaFilteredByCaption.slice(0, options.count);

                    // console.log("sliced array", slicedArray);
                    // var slicedRes = resData.slice(0, options.count)

                    var itemsProcessed = 0;

                    function asyncFunction(media, cb) {
                        setTimeout(() => {
                            var res = media;
                            var $li = $('<li/>');
                            $this.find('ul.agni-block-instagram-items').append($li);

                            var $html = '';
                            $html += '<a href="' + res.permalink + '" target="' + options.linkTarget + '">';
                            $html += '<figure>';
                            $html += '<img width="1080" height="1080" src="' + res.media_url + '" alt="' + res.caption + '" />';
                            if (options.caption) {
                                $html += '<figcaption>' + res.caption + '</figcaption>';
                            }
                            $html += '</figure>';
                            $html += '</a>';

                            $li.append($html);
                            cb();
                        }, 100);
                    }

                    slicedArray.forEach(function (media, index, array) {
                        asyncFunction(media, () => {
                            itemsProcessed++;
                            if (itemsProcessed === array.length) {
                                if ($ul.hasClass('agni-block-has-carousel')) {
                                    if ($ul.hasClass('slick-initialized')) {
                                        $ul.slick('unslick');
                                    }
                                    $ul.agni_block_carousel();
                                }
                            }
                        });
                    })
                })

                // console.log("response json", instagramMedia);

                // var mediaResJSONData = mediaResData.responseJSON
            }
        }



        $.fn.agniToggle = function (accordion = false) {
            var panels = $(this);
            panels.each(function () {
                var panel = $(this);
                panel.find('.agni-block-toggle-title').on('click', function () {

                    if (accordion) {
                        panels.not(panel).removeClass('active');
                    }

                    if (panel.hasClass('active')) {
                        panel.removeClass('active');
                    }
                    else {
                        panel.addClass('active');
                    }
                })
            })
        }


        // Accordion
        $('.agni-block-accordion').each(function () {
            var $this = $(this);
            var panels = $this.find('>div');
            panels.agniToggle(true);
        })

        // Agni Toggle
        $('.agni-block-toggle:not(.child)').agniToggle();

        $.fn.agniTabs = function () {
            var $this = $(this);

            var tabTitles = $this.find('.agni-block-tab-title');
            var tabContents = $this.find('.agni-block-tab');

            // console.log(tabTitles, tabContents);

            tabTitles.each(function (index) {
                var tabTitle = $(this);
                var tabIndex = index;

                tabTitle.on('click', function () {
                    tabTitles.removeClass('active');
                    tabTitle.addClass('active');
                    // tabContents.not('.active').addClass('')
                    tabContents.removeClass('active');
                    tabContents.each(function (index) {
                        if (index === tabIndex) {
                            $(this).addClass('active');
                        }
                    })
                })
            })
        }


        // Agni tabs
        $('.agni-block-tabs').each(function () {
            $(this).agniTabs();
        })

        // Agni video
        $('.agni-block-video').each(function () {
            var $this = $(this);

            if ($this.hasClass('provider-youtube')) {
                $this.find('.agni-block-video-controls > button').on('click', function () {
                    var $button = $(this);

                    if ($button.hasClass('agni-block-video-controls--play')) {
                        $button.trigger('agniYoutubePlay');
                        $this.addClass('initiated');
                    }
                    if ($button.hasClass('agni-block-video-controls--pause')) {
                        $button.trigger('agniYoutubePause');
                    }

                })
            }

            if ($this.hasClass('provider-vimeo')) {
                $this.find('.agni-block-video-controls > button').on('click', function () {
                    var $button = $(this);
                    var $player = $this.find('iframe');

                    if ($button.hasClass('agni-block-video-controls--play')) {
                        $player.play_video();
                        $this.addClass('initiated');
                    }
                    if ($button.hasClass('agni-block-video-controls--pause')) {
                        $player.pause_video();
                    }
                })
            }
            if ($this.hasClass('provider-self')) {
                $this.find('.agni-block-video-controls > button').on('click', function () {
                    var $button = $(this);
                    var $player = $this.find('video')[0];

                    if ($button.hasClass('agni-block-video-controls--play')) {
                        $player.play();
                        $this.addClass('initiated');
                    }
                    if ($button.hasClass('agni-block-video-controls--pause')) {
                        $player.pause();
                    }
                })
            }
        })


        $.fn.play_video = function () {
            var player = $(this)[0]; //document.getElementById("agni-video-2");
            var data = { method: "play" };
            player.contentWindow.postMessage(JSON.stringify(data), "*");
        }

        $.fn.pause_video = function () {
            var player = $(this)[0];
            var data = { method: "pause" };
            player.contentWindow.postMessage(JSON.stringify(data), "*");
        }


        $('.agni-block-hotspot').each(function () {
            var $this = $(this),
                spots = $this.find('.agni-block-hotspot__spot');
            // icon = spot.find('.agni-block-hotspot__spot-icon');


            var spot_product_container = '<div class="agni-block-hotspot-product product"></div>';
            var spot_loader = '<div class="loader">Loading!</div>';

            spots.each(function () {
                var spot = $(this);
                var icon = spot.find('.agni-block-hotspot__spot-icon');
                var product_ids = spot.data('product-ids');

                if (!product_ids) {
                    return null;
                }


                var product_data = {
                    ids: product_ids
                };

                icon.on('click', function () {

                    var spot_content_loaded = spot.find('.agni-block-hotspot-product').children().length;

                    if (spot_content_loaded !== 0) {
                        if (spot.hasClass('hidden')) {
                            spot.removeClass('hidden');
                        }
                        else {
                            spot.addClass('hidden')
                        }
                    }
                    else {
                        spot.append(spot_product_container);
                        spot.find('.agni-block-hotspot-product').append(spot_loader);

                        spot.addClass('loading');

                        $.ajax({
                            url: agni_builder_frontend.ajaxurl_wc.toString().replace('%%endpoint%%', 'agni_builder_hotspot'),
                            type: 'POST',
                            data: product_data,
                            success: function (response) {
                                // console.log(response);
                                if (!response) {
                                    return;
                                }

                                spot.removeClass('loading');

                                spot.find('.agni-block-hotspot-product').html(response);
                                // spot.append(spot_product_container);


                                // var data = {};

                                // data['add-to-cart'] = product_id;

                                $('.ajax_add_to_cart').on('click', function (e) {
                                    e.preventDefault();
                                    // console.log("Clicked", product_id);
                                    // $(document.body).trigger('adding_to_cart', [$(this), { product_id: product_id }]);
                                    $.add_to_cart($(this), { product_id: product_ids });

                                });
                                // $('.agni-block-products-categories-tab__contents').html(response);
                            }
                        })
                    }
                })
            })

        });


        $.fn.initializeMap_v2 = function (id, { locations, mapStyle, zoom, markerIcon }) {

            var map = new google.maps.Map(document.getElementById(id), {
                zoom: zoom,
                center: new google.maps.LatLng(locations[0].lat, locations[0].lng),
                mapTypeControl: false,
                mapTypeControlOptions: {
                    mapTypeIds: ['Styled']
                },
                navigationControl: true,
                navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL },
                mapTypeId: 'Styled',
            });
            var styledMapType = new google.maps.StyledMapType(mapStyles[mapStyle], { name: 'Styled' });
            map.mapTypes.set('Styled', styledMapType);

            var infowindow = new google.maps.InfoWindow();

            var mapMarker = {
                url: markerIcon || agni_builder_frontend.map_marker,
                size: new google.maps.Size(50, 70),
                origin: new google.maps.Point(0, 0),
                scaledSize: new google.maps.Size(25, 35)
            };

            var marker, i;

            for (i = 0; i < locations.length; i++) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
                    map: map,
                    icon: mapMarker,
                    title: locations[i].location,
                    zIndex: 3
                });

                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        infowindow.setContent("<h6>" + locations[i].location + "</h6>" + locations[i].address);
                        infowindow.open(map, marker);
                    }
                })(marker, i));
            }
        }


        $('.agni-block-map').each(function () {

            var $element = $(this);
            var id = $element.attr('id');


            if (typeof google == 'undefined') {
                $element.html('No api key found. Make sure that you\'ve added at "Appearance->Customize->Cartify Theme Options->API Keys"');

                return null;
            }

            var options = $element.data('options');

            $element.initializeMap_v2(id, options);
        })



        // Animation 
        const Obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                entry.isIntersecting ? entry.target.classList.add("has-animation-in-viewport") : ''
            });
        });

        $('.has-animation').each(function () {
            var $this = $(this);
            var el = $this[0];

            var elOptions = $this.data('animation-options') || {};

            Obs.observe(el, elOptions);
        });


    })
})(jQuery);



var mapStyles = { "1": [{ "stylers": [{ "hue": "#ff1a00" }, { "invert_lightness": true }, { "saturation": -100 }, { "lightness": 33 }, { "gamma": 0.5 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#2D333C" }] }], "2": [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#1e1e20" }, { "visibility": "on" }] }], "3": [{ "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#000000" }, { "lightness": 40 }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#000000" }, { "lightness": 16 }] }, { "featureType": "all", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 17 }, { "weight": 1.2 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 20 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 21 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 16 }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 19 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 17 }] }], "4": [{ "featureType": "landscape", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "stylers": [{ "hue": "#00aaff" }, { "saturation": -100 }, { "gamma": 2.15 }, { "lightness": 12 }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "visibility": "on" }, { "lightness": 24 }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "lightness": 57 }] }] };