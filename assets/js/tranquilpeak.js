(function($) {
  'use strict';

  // Fade out the blog and let drop the about card of the author and vice versa

  /**
   * AboutCard
   * @constructor
   */
  var AboutCard = function() {
    this.$openBtn = $("#sidebar, #header").find("a[href*='#about']");
    this.$closeBtn = $('#about-btn-close');
    this.$blog = $('#blog');
    this.$about = $('#about');
    this.$searchTool = $('.search-tools-col');
    this.$canvas = $('.anm-canvas');
    this.$aboutCard = $('#about-card');
  };

  AboutCard.prototype = {

    /**
     * Run AboutCard feature
     * @return {void}
     */
    run: function() {
      var self = this;
      // Detect click on open button
      self.$openBtn.click(function(e) {
        e.preventDefault();
        self.play();
      });
      // Detect click on close button
      self.$closeBtn.click(function(e) {
        e.preventDefault();
        self.playBack();
      });
    },

    /**
     * Play the animation
     * @return {void}
     */
    play: function() {
      var self = this;
      // Fade out the blog
      self.$searchTool.fadeOut();
      self.$canvas.fadeOut();
      self.$blog.fadeOut();
      // Fade in the about card
      self.$about.fadeIn();
      // Small timeout to drop the about card after that
      // the about card fade in and the blog fade out
      setTimeout(function() {
        self.dropAboutCard();
      }, 300);
    },

    /**
     * Play back the animation
     * @return {void}
     */
    playBack: function() {
      var self = this;
      // Lift the about card
      self.liftAboutCard();
      // Fade in the blog after that the about card lifted up
      setTimeout(function() {
        self.$searchTool.fadeIn();
        self.$canvas.fadeIn();
        self.$blog.fadeIn();
      }, 500);
      // Fade out the about card after that the about card lifted up
      setTimeout(function() {
        self.$about.fadeOut();
      }, 500);
    },

    /**
     * Slide the card to the middle
     * @return {void}
     */
    dropAboutCard: function() {
      var self = this;
      var aboutCardHeight = self.$aboutCard.innerHeight();
      // default offset from top
      var offsetTop = ($(window).height() / 2) - (aboutCardHeight / 2) + aboutCardHeight;
      // if card is longer than the window
      // scroll is enable
      // and re-define offsetTop
      if (aboutCardHeight + 30 > $(window).height()) {
        offsetTop = aboutCardHeight;
      }
      self.$aboutCard
        .css('top', '0px')
        .css('top', '-' + aboutCardHeight + 'px')
        .show(500, function() {
          self.$aboutCard.animate({
            top: '+=' + offsetTop + 'px'
          });
        });
    },

    /**
     * Slide the card to the top
     * @return {void}
     */
    liftAboutCard: function() {
      var self = this;
      var aboutCardHeight = self.$aboutCard.innerHeight();
      // default offset from top
      var offsetTop = ($(window).height() / 2) - (aboutCardHeight / 2) + aboutCardHeight;
      if (aboutCardHeight + 30 > $(window).height()) {
        offsetTop = aboutCardHeight;
      }
      self.$aboutCard.animate({
        top: '-=' + offsetTop + 'px'
      }, 500, function() {
        self.$aboutCard.hide();
        self.$aboutCard.removeAttr('style');
      });
    }
  };

  $(document).ready(function() {
    var aboutCard = new AboutCard();
    aboutCard.run();
  });
})(jQuery);
;(function($) {
  'use strict';

  // Filter posts by using their date on archives page : `/archives`

  /**
   * ArchivesFilter
   * @param {String} archivesElem
   * @constructor
   */
  var ArchivesFilter = function(archivesElem) {
    this.$form = $(archivesElem).find('#filter-form');
    this.$searchInput = $(archivesElem).find('input[name=date]');
    this.$archiveResult = $(archivesElem).find('.archive-result');
    this.$postsYear = $(archivesElem).find('.archive-year');
    this.$postsMonth = $(archivesElem).find('.archive-month');
    this.$postsDay = $(archivesElem).find('.archive-day');
    this.postsYear = archivesElem + ' .archive-year';
    this.postsMonth = archivesElem + ' .archive-month';
    this.postsDay = archivesElem + ' .archive-day';
    this.messages = {
      zero: this.$archiveResult.data('message-zero'),
      one: this.$archiveResult.data('message-one'),
      other: this.$archiveResult.data('message-other')
    };
  };

  ArchivesFilter.prototype = {

    /**
     * Run ArchivesFilter feature
     * @return {void}
     */
    run: function() {
      var self = this;

      self.$searchInput.keyup(function() {
        self.filter(self.sliceDate(self.getSearch()));
      });

      // Block submit action
      self.$form.submit(function(e) {
        e.preventDefault();
      });
    },

    /**
     * Get Filter entered by user
     * @returns {String} The date entered by the user
     */
    getSearch: function() {
      return this.$searchInput.val().replace(/([\/|.|-])/g, '').toLowerCase();
    },

    /**
     * Slice the date by year, month and day
     * @param {String} date - The date of the post
     * @returns {Array} The date of the post splitted in a list
     */
    sliceDate: function(date) {
      return [
        date.slice(0, 4),
        date.slice(4, 6),
        date.slice(6)
      ];
    },

    /**
     * Show related posts and hide others
     * @param {String} date - The date of the post
     * @returns {void}
     */
    filter: function(date) {
      var numberPosts;

      // Check if the search is empty
      if (date[0] === '') {
        this.showAll();
        this.showResult(-1);
      }
      else {
        numberPosts = this.countPosts(date);

        this.hideAll();
        this.showResult(numberPosts);

        if (numberPosts > 0) {
          this.showPosts(date);
        }
      }
    },

    /**
     * Display results
     * @param {Number} numbPosts - The number of posts found
     * @returns {void}
     */
    showResult: function(numbPosts) {
      if (numbPosts === -1) {
        this.$archiveResult.html('').hide();
      }
      else if (numbPosts === 0) {
        this.$archiveResult.html(this.messages.zero).show();
      }
      else if (numbPosts === 1) {
        this.$archiveResult.html(this.messages.one).show();
      }
      else {
        this.$archiveResult.html(this.messages.other.replace(/\{n\}/, numbPosts)).show();
      }
    },

    /**
     * Count number of posts
     * @param {String} date - The date of the post
     * @returns {Number} The number of posts found
     */
    countPosts: function(date) {
      return $(this.postsDay + '[data-date^=' + date[0] + date[1] + date[2] + ']').length;
    },

    /**
     * Show all posts from a date
     * @param {String} date - The date of the post
     * @returns {void}
     */
    showPosts: function(date) {
      $(this.postsYear + '[data-date^=' + date[0] + ']').show();
      $(this.postsMonth + '[data-date^=' + date[0] + date[1] + ']').show();
      $(this.postsDay + '[data-date^=' + date[0] + date[1] + date[2] + ']').show();
    },

    /**
     * Show all posts
     * @returns {void}
     */
    showAll: function() {
      this.$postsYear.show();
      this.$postsMonth.show();
      this.$postsDay.show();
    },

    /**
     * Hide all posts
     * @returns {void}
     */
    hideAll: function() {
      this.$postsYear.hide();
      this.$postsMonth.hide();
      this.$postsDay.hide();
    }
  };

  $(document).ready(function() {
    if ($('#archives').length) {
      var archivesFilter = new ArchivesFilter('#archives');
      archivesFilter.run();
    }
  });
})(jQuery);
;(function($) {
  'use strict';

  // Filter posts by using their categories on categories page : `/categories`

  /**
   * CategoriesFilter
   * @param {String} categoriesArchivesElem
   * @constructor
   */
  var CategoriesFilter = function(categoriesArchivesElem) {
    this.$form = $(categoriesArchivesElem).find('#filter-form');
    this.$inputSearch = $(categoriesArchivesElem).find('input[name=category]');
    // Element where result of the filter are displayed
    this.$archiveResult = $(categoriesArchivesElem).find('.archive-result');
    this.$posts = $(categoriesArchivesElem).find('.archive');
    this.$categories = $(categoriesArchivesElem).find('.category-anchor');
    this.posts = categoriesArchivesElem + ' .archive';
    this.categories = categoriesArchivesElem + ' .category-anchor';
    // Html data attribute without `data-` of `.archive` element
    // which contains the name of category
    this.dataCategory = 'category';
    // Html data attribute without `data-` of `.archive` element
    // which contains the name of parent's categories
    this.dataParentCategories = 'parent-categories';
    this.messages = {
      zero: this.$archiveResult.data('message-zero'),
      one: this.$archiveResult.data('message-one'),
      other: this.$archiveResult.data('message-other')
    };
  };

  CategoriesFilter.prototype = {

    /**
     * Run CategoriesFilter feature
     * @return {void}
     */
    run: function() {
      var self = this;

      self.$inputSearch.keyup(function() {
        self.filter(self.getSearch());
      });

      // Block submit action
      self.$form.submit(function(e) {
        e.preventDefault();
      });
    },

    /**
     * Get the search entered by user
     * @returns {String} The name of the category
     */
    getSearch: function() {
      return this.$inputSearch.val().toLowerCase();
    },

    /**
     * Show related posts form a category and hide the others
     * @param {string} category - The name of the category
     * @return {void}
     */
    filter: function(category) {
      if (category === '') {
        this.showAll();
        this.showResult(-1);
      }
      else {
        this.hideAll();
        this.showPosts(category);
        this.showResult(this.countCategories(category));
      }
    },

    /**
     * Display results of the search
     * @param {Number} numbCategories - The number of categories found
     * @return {void}
     */
    showResult: function(numbCategories) {
      if (numbCategories === -1) {
        this.$archiveResult.html('').hide();
      }
      else if (numbCategories === 0) {
        this.$archiveResult.html(this.messages.zero).show();
      }
      else if (numbCategories === 1) {
        this.$archiveResult.html(this.messages.one).show();
      }
      else {
        this.$archiveResult.html(this.messages.other.replace(/\{n\}/, numbCategories)).show();
      }
    },

    /**
     * Count number of categories
     * @param {String} category - The name of theThe date of the post category
     * @returns {Number} The number of categories found
     */
    countCategories: function(category) {
      return $(this.posts + '[data-' + this.dataCategory + '*=\'' + category + '\']').length;
    },

    /**
     * Show all posts from a category
     * @param {String} category - The name of the category
     * @return {void}
     */
    showPosts: function(category) {
      var self = this;
      var parents;
      var categories = self.categories + '[data-' + self.dataCategory + '*=\'' + category + '\']';
      var posts = self.posts + '[data-' + self.dataCategory + '*=\'' + category + '\']';

      if (self.countCategories(category) > 0) {
        // Check if selected categories have parents
        if ($(categories + '[data-' + self.dataParentCategories + ']').length) {
          // Get all categories that matches search
          $(categories).each(function() {
            // Get all its parents categories name
            parents = $(this).attr('data-' + self.dataParentCategories).split(',');
            // Show only the title of the parents's categories and hide their posts
            parents.forEach(function(parent) {
              var dataAttr = '[data-' + self.dataCategory + '=\'' + parent + '\']';
              $(self.categories + dataAttr).show();
              $(self.posts + dataAttr).show();
              $(self.posts + dataAttr + ' > .archive-posts > .archive-post').hide();
            });
          });
        }
      }
      // Show categories and related posts found
      $(categories).show();
      $(posts).show();
      $(posts + ' > .archive-posts > .archive-post').show();
    },

    /**
     * Show all categories and all posts
     * @return {void}
     */
    showAll: function() {
      this.$categories.show();
      this.$posts.show();
      $(this.posts + ' > .archive-posts > .archive-post').show();
    },

    /**
     * Hide all categories and all posts
     * @return {void}
     */
    hideAll: function() {
      this.$categories.hide();
      this.$posts.hide();
    }
  };

  $(document).ready(function() {
    if ($('#categories-archives').length) {
      var categoriesFilter = new CategoriesFilter('#categories-archives');
      categoriesFilter.run();
    }
  });
})(jQuery);
;(function($) {
  'use strict';

  // Resize code blocks to fit the screen width

  /**
   * Code block resizer
   * @param {String} elem
   * @constructor
   */
  var CodeBlockResizer = function(elem) {
    this.$codeBlocks = $(elem);
    this.$sidebar = $('#sidebar');
  };

  CodeBlockResizer.prototype = {
    /**
     * Run main feature
     * @return {void}
     */
    run: function() {
      var self = this;
      setTimeout(function() {
        //self.resize();
      }, 100);
      // resize codeblocks when window is resized
      $(window).resize(function() {
        //self.resize();
      });
    },

    /**
     * Resize codeblocks
     * @return {void}
     */
    resize: function() {
      var self = this;
      self.$codeBlocks.each(function() {
        var code = $(this).find('td.code');
        var table = $(this).find('table');
        var windowWidth = $(window).width();
        var gutter = table.find('.gutter');
        var gutterWidth = gutter.outerWidth(); // always 15px;
        var paddingLeft = parseInt(code.css('padding-left').substr(0, 2), 10);
        var paddingRight = parseInt(code.css('padding-right').substr(0, 2), 10);

        if (windowWidth < 768 || gutter.length <= 0) {
          gutterWidth = 0;
        }
        var width = table.width() - gutterWidth - paddingRight - paddingLeft;
        code.find('pre').css('width', width);
      });
    }
  };

  $(document).ready(function() {
    // register jQuery function to check if an element has an horizontal scroll bar
    $.fn.hasHorizontalScrollBar = function() {
      return this.get(0).scrollWidth > this.innerWidth();
    };
    var resizer = new CodeBlockResizer('figure.highlight');
    resizer.run();
  });
})(jQuery);
;/* eslint-disable no-unused-vars */
(function($) {
  'use strict';

  // Run fancybox feature

  $(document).ready(function() {
    /**
     * Configure and run Fancybox plugin
     * @returns {void}
     */
    function fancyFox() {
      var arrows = true;
      var thumbs = null;

      // disable navigation arrows and display thumbs on medium and large screens
      if ($(window).height() > 480) {
        arrows = false;
        thumbs = {
          width: 70,
          height: 70
        };
      }

      $('.fancybox').fancybox({
        buttons: [
          'fullScreen',
          'thumbs',
          'share',
          'download',
          'zoom',
          'close'
        ],
        thumbs: {
          autoStart: true,
          axis: 'x'
        }
      });
    }

    fancyFox();

    $(window).smartresize(function() {
      fancyFox();
    });
  });
})(jQuery);
;/* eslint-disable brace-style */
(function($) {
  'use strict';

  /**
   * fix table content
   * https://github.com/jeremychurch/FixedContent.js
   */

  /**
   * FixContent
   * @constructor
   */
  var FixContent = function() {
    this.$jsFixedContent = $('.toc.js-fixedContent');
    this.lastScroll = 0;
    this.contentOffset = 0;
    this.tocMessage = $('.tableContent').data('message');
    this.options = {
      marginTop: 50,
      minWidth: 768 + 160
    };
  };

  FixContent.prototype = {
    /**
     * Run FixContent feature
     * @return {void}
     */
    run: function() {
      var self = this;
      if (this.$jsFixedContent.length && this.tocMessage !== undefined) {
        if ($(window).innerWidth() >= this.options.minWidth) {
          $(window).scroll(function() {
            self.fixedContent();
            self.setContentPosition();
          });
        }
      }
    },

    fixedContent: function() {
      this.setContentPosition();
    },

    setContentPosition: function() {
      var self = this;
      if (self.contentOffset === 0) {
        self.contentOffset = self.getContentOffset();
      }
      if ($(window).scrollTop() >= (self.contentOffset - this.options.marginTop)) {
        this.$jsFixedContent.css({
          position: 'fixed',
          top: self.options.marginTop
        });
        if (this.lastScroll === 0) {
          self.lastScroll = $(window).scrollTop();
        }
      } else if ($(window).scrollTop() <= self.lastScroll) {
        this.$jsFixedContent.css({
          position: 'static',
          top: ''
        });
        self.lastScroll = 0;
      }
    },

    getContentOffset: function() {
      return this.$jsFixedContent.offset().top;
    }
  };

  $(document).ready(function() {
    var fixContent = new FixContent();
    fixContent.run();
  });
})(jQuery);
;(function($) {
  'use strict';

  /**
   * Sidebar
   * @constructor
   */
  var HeadProfile = function() {
    this.$sidebar = $('#sidebar');
    this.$main = $('#main');
    this.$blogButton = $('.blog-button-full-screen');
    this.$headProfile = $('.full-screen-head');
    this.$cover = $('#cover');
    this.$firstPageDesc = $('.first-page-desc-container');
    this.topWhitespace = $('.sidebar-top-whitespace');
    this.bottomWhitespace = $('.sidebar-bottom-whitespace');
    this.$sidebarContainer = $('.sidebar-container');
  };

  HeadProfile.prototype = {
    /**
     * Run Sidebar feature
     * @return {void}
     */
    run: function() {
      var self = this;

      // Detect the click on the open button
      self.$blogButton.click(function() {
        if (location.hash && location.hash === "#blog") {
          return;
        }
        self.removeFullScreen();
      });

      /* first page*/
      if (window.location.hash === "" && window.location.pathname === "/") {
        this.$cover.css('z-index', '100');
        this.$headProfile.removeClass('hidden');
        this.$firstPageDesc.removeClass('hidden');
        return;
      }

      if (window.location.hash && window.location.hash === "#blog") {
        self.removeFullScreen();
        return;
      }
      if (window.location.hash === "") {
        self.removeFullScreen();
      }
    },

    removeFullScreen: function() {
      this.changeZIndex();
      this.removeHiddenClass();
      this.removeFadeInClass();
    },

    /**
     * remove fadeIn for main
     * @returns {void}
     */
    removeFadeInClass: function() {
      var self = this;
      if (this.$main.hasClass('fade-in')) {
        setTimeout(function() {
          self.$main.removeClass('fade-in');
        });
      }
    },

    /**
     * set whitespace height
     * @returns {void}
     */
    setWhiteSpace: function() {
      var topWhitespaceHeight = this.$sidebarContainer.position().top;
      var bottomWhitespaceHeight = $(window).height() - this.$sidebarContainer.height() -
        topWhitespaceHeight;
      this.topWhitespace.css('height', topWhitespaceHeight + 'px');
      this.bottomWhitespace.css('height', bottomWhitespaceHeight + 'px');
    },

    /**
     * remove hidden class for #main, #sidebar
     * @return {void}
     */
    removeHiddenClass: function() {
      // this.$main.css('display', 'block');
      if (!this.$firstPageDesc.hasClass('hidden')) {
        this.$firstPageDesc.addClass('hidden');
      }
      if (this.$main.hasClass('hidden')) {
        this.$main.removeClass('hidden');
      }
      if (this.$sidebar.hasClass('hidden')) {
        this.$sidebar.removeClass('hidden');
      }

      this.setWhiteSpace();
    },

    addHideClass: function() {
      this.$firstPageDesc.addClass('hide');
      this.$headProfile.addClass('hide');
    },

    /**
     *  change cover's z-index from 1050 to -1
     *  @return {void}
     */
    changeZIndex: function() {
      this.$cover.css('z-index', '-1');
      this.addHideClass();
    }
  };

  $(document).ready(function() {
    var headProfile = new HeadProfile();
    headProfile.run();
  });
})(jQuery);
;(function($) {
  'use strict';

  // Hide the header when the user scrolls down, and show it when he scrolls up

  /**
   * Header
   * @constructor
   */
  var Header = function() {
    this.$header = $('#header');
    this.headerHeight = this.$header.height();
    // CSS class located in `source/_css/layout/_header.scss`
    this.headerUpCSSClass = 'header-up';
    this.delta = 5;
    this.lastScrollTop = 0;
  };

  Header.prototype = {

    /**
     * Run Header feature
     * @return {void}
     */
    run: function() {
      var self = this;
      var didScroll;

      // Detect if the user is scrolling
      $(window).scroll(function() {
        didScroll = true;
      });

      // Check if the user scrolled every 250 milliseconds
      setInterval(function() {
        if (didScroll) {
          self.animate();
          didScroll = false;
        }
      }, 250);
    },

    /**
     * Animate the header
     * @return {void}
     */
    animate: function() {
      var scrollTop = $(window).scrollTop();

      // Check if the user scrolled more than `delta`
      if (Math.abs(this.lastScrollTop - scrollTop) <= this.delta) {
        return;
      }

      // Checks if the user has scrolled enough down and has past the navbar
      if ((scrollTop > this.lastScrollTop) && (scrollTop > this.headerHeight)) {
        this.$header.addClass(this.headerUpCSSClass);
      }
      else if (scrollTop + $(window).height() < $(document).height()) {
        this.$header.removeClass(this.headerUpCSSClass);
      }

      this.lastScrollTop = scrollTop;
    }
  };

  $(document).ready(function() {
    var header = new Header();
    header.run();
  });
})(jQuery);
;(function($) {
  'use strict';

  // Resize all images of an image-gallery

  /**
   * ImageGallery
   * @constructor
   */
  var ImageGallery = function() {
    // CSS class located in `source/_css/components/_image-gallery.scss`
    this.photosBox = '.photo-box';
    this.$images = $(this.photosBox + ' img');
  };
  ImageGallery.prototype = {

    /**
     * Run ImageGallery feature
     * @return {void}
     */
    run: function() {
      var self = this;

      // Resize all images at the loading of the page
      self.resizeImages();

      // Resize all images when the user is resizing the page
      $(window).smartresize(function() {
        self.resizeImages();
      });
    },

    /**
     * Resize all images of an image gallery
     * @return {void}
     */
    resizeImages: function() {
      var photoBoxWidth;
      var photoBoxHeight;
      var imageWidth;
      var imageHeight;
      var imageRatio;
      var $image;

      this.$images.each(function() {
        $image = $(this);
        photoBoxWidth = $image.parent().parent().width();
        photoBoxHeight = $image.parent().parent().innerHeight();
        imageWidth = $image.width();
        imageHeight = $image.height();

        // Checks if image height is smaller than his box
        if (imageHeight < photoBoxHeight) {
          imageRatio = (imageWidth / imageHeight);
          // Resize image with the box height
          $image.css({
            height: photoBoxHeight,
            width: (photoBoxHeight * imageRatio)
          });
          // Center image in his box
          $image.parent().css({
            left: '-' + (((photoBoxHeight * imageRatio) / 2) - (photoBoxWidth / 2)) + 'px'
          });
        }

        // Update new values of height and width
        imageWidth = $image.width();
        imageHeight = $image.height();

        // Checks if image width is smaller than his box
        if (imageWidth < photoBoxWidth) {
          imageRatio = (imageHeight / imageWidth);

          $image.css({
            width: photoBoxWidth,
            height: (photoBoxWidth * imageRatio)
          });
          // Center image in his box
          $image.parent().css({
            top: '-' + (((imageHeight) / 2) - (photoBoxHeight / 2)) + 'px'
          });
        }

        // Checks if image height is larger than his box
        if (imageHeight > photoBoxHeight) {
          // Center image in his box
          $image.parent().css({
            top: '-' + (((imageHeight) / 2) - (photoBoxHeight / 2)) + 'px'
          });
        }
      });
    }
  };

  $(document).ready(function() {
    if ($('.image-gallery').length) {
      var imageGallery = new ImageGallery();

      // Small timeout to wait the loading of all images.
      setTimeout(function() {
        imageGallery.run();
      }, 500);
    }
  });
})(jQuery);
;(function($) {
  'use strict';

  // Open and close the sidebar by swiping the sidebar and the blog and vice versa

  /**
   * Sidebar
   * @constructor
   */
  var Pagination = function() {
    this.$pageNav = $('#page-nav');
    this.$extendPrev = this.$pageNav.find('.extend.prev');
    this.$extendNext = this.$pageNav.find('.extend.next');
  };

  Pagination.prototype = {
    /**
     * Run Pagination feature
     * @return {void}
     */
    run: function() {
      var self = this;
      self.$pageNav.children("*").each(function() {
        if ($(this).attr('href') === '/') {
          $(this).attr('href', '/#blog');
        }
      });

      this.$extendPrev.addClass('fa fa-lg fa-arrow-circle-left');
      this.$extendNext.addClass('fa fa-lg fa-arrow-circle-right');
    }

  };

  $(document).ready(function() {
    var pagination = new Pagination();
    pagination.run();
  });
})(jQuery);
;(function($) {
  'use strict';

  // Hide the post bottom bar when the post footer is visible by the user,
  // and show it when the post footer isn't visible by the user

  /**
   * PostBottomBar
   * @constructor
   */
  var PostBottomBar = function() {
    this.$postBottomBar = $('.post-bottom-bar');
    this.$postFooter = $('.post-actions-wrap');
    this.$header = $('#header');
    this.delta = 1;
    this.lastScrollTop = 0;
  };

  PostBottomBar.prototype = {

    /**
     * Run PostBottomBar feature
     * @return {void}
     */
    run: function() {
      var self = this;
      var didScroll;
      // Run animation for first time
      self.swipePostBottomBar();
      // Detects if the user is scrolling
      $(window).scroll(function() {
        didScroll = true;
      });
      // Check if the user scrolled every 250 milliseconds
      setInterval(function() {
        if (didScroll) {
          self.swipePostBottomBar();
          didScroll = false;
        }
      }, 250);
    },

    /**
     * Swipe the post bottom bar
     * @return {void}
     */
    swipePostBottomBar: function() {
      var scrollTop = $(window).scrollTop();
      var postFooterOffsetTop = this.$postFooter.offset().top;
      // show bottom bar
      // if the user scrolled upwards more than `delta`
      // and `post-footer` div isn't visible
      if (this.lastScrollTop > scrollTop &&
        (postFooterOffsetTop + this.$postFooter.height() > scrollTop + $(window).height() ||
          postFooterOffsetTop < scrollTop + this.$header.height())) {
        this.$postBottomBar.slideDown();
      }
      else {
        this.$postBottomBar.slideUp();
      }
      this.lastScrollTop = scrollTop;
    }
  };

  $(document).ready(function() {
    if ($('.post-bottom-bar').length) {
      var postBottomBar = new PostBottomBar();
      postBottomBar.run();
    }
  });
})(jQuery);
;(function($) {
  'use strict';

  // Hide the post bottom bar when the post footer is visible by the user,
  // and show it when the post footer isn't visible by the user

  /**
   * PostBottomThumbnailImg
   * @constructor
   */
  var PostBottomThumbnailImg = function() {
    this.$postShortenThumbnailimgBottom = $('.postShorten--thumbnailimg-bottom');
    this.$postBottomThumb = this.$postShortenThumbnailimgBottom.find('.postShorten-thumbnailimg');
    this.$postBottomImg = this.$postBottomThumb.find('img');
    this.$sidebar = $('#sidebar');
  };

  PostBottomThumbnailImg.prototype = {

    /**
     * Run PostBottomThumbnailImg feature
     * @return {void}
     */
    run: function() {
      var self = this;
      setTimeout(function() {
        // self.resize();
      }, 100);
      // resize postShorten--thumbnailimg when window is resized
      $(window).resize(function() {
        // self.resize();
      });
    },

    resize: function() {
      var self = this;
      self.$postBottomImg.each(function() {
        var windowWidth = $(window).width();
        var sidebarWidth = self.$sidebar.width();

        if (self.$sidebar.css('left') < 0) {
          sidebarWidth = 0;
        }
        var width = (windowWidth - sidebarWidth) * 2 / 3 * 0.98 / 3;
        if (width > 200) {
          width = 200;
        }
        self.$postBottomImg.css('height', width);
      });
    }
  };

  $(document).ready(function() {
    var postBottomThumbnailImg = new PostBottomThumbnailImg();
    postBottomThumbnailImg.run();
  });
})(jQuery);
;/* eslint-disable brace-style,guard-for-in,no-unused-vars,require-jsdoc,max-len */
(function($) {
  'use strict';

  /**
   * Open search modal
   * @constructor
   */
  var SearchToolsColModal = function() {
    this.$searchToolsCol = $('.search-tools-col');
    this.$openButton = $('.open-search-col, .btn-open-search');
    this.$main = $('#main');
    this.$canvas = $('#anm-canvas');
    this.$header = $('#header');
    this.$closeButton = $('#main, .sidebar-top-whitespace, .sidebar-bottom-whitespace,' +
      '.post-header, #search-post-title');
    this.topWhitespace = $('.sidebar-top-whitespace');
    this.bottomWhitespace = $('.sidebar-bottom-whitespace');
    this.$searchInput = $('.search-ipt');
    this.$results = this.$searchToolsCol.find('.search-result');
    this.$noResults = this.$searchToolsCol.find('.no-result');
    this.$resultsCount = this.$searchToolsCol.find('.results-count');
    this.$sidebarContainer = $('.sidebar-container');
    this.$postHeaderCover = $('.post-header-cover');
    this.$postBottomBar = $('.post-bottom-bar');
    this.$sidebar = $('#sidebar');
    this.$body = $('body');
    this.$articleTagListItem = $('.article-tag-list-item');
    this.algolia = algoliaIndex;
  };

  SearchToolsColModal.prototype = {
    /**
     * Run feature
     * @returns {void}
     */
    run: function() {
      var self = this;

      self.handleSearch();

      self.setWhiteSpace();

      // open modal when open button is clicked
      self.$openButton.click(function() {
        self.open();
      });

      // open modal when `s` button is pressed
      $(document).keyup(function(event) {
        var target = event.target || event.srcElement;
        // exit if user is focusing an input or textarea
        var tagName = target.tagName.toUpperCase();
        if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
          return;
        }

        if (event.keyCode === 83 && !self.$searchToolsCol.is(':visible')) {
          self.open();
        }
      });

      // // close button when overlay is clicked
      self.$searchToolsCol.click(function(e) {
        if (e.target === this) {
          self.close();
        }
      });

      // close modal when close button is clicked
      self.$closeButton.click(function(e) {
        self.close();
      });

      // close modal when `ESC` button is pressed
      $(document).keyup(function(e) {
        if (e.keyCode === 27 && self.$searchToolsCol.is(':visible')) {
          self.close();
        }
      });

      // Detect resize of the windows
      $(window).resize(function() {
        self.setWhiteSpace();
      });

      self.setArticleTagListItemClick();
      self.setSearchPostTags();
      self.setSearchDate();
    },

    /**
     * set whitespace height
     * @returns {void}
     */
    setArticleTagListItemClick: function() {
      var self = this;
      self.$articleTagListItem.each(function() {
        $(this).click(function() {
          var tagName = $(this).text().trim();
          self.$searchInput.val(tagName);
          self.searchWithAloglia(tagName);
        });
      });
    },

    /**
     * set search post tags click function
     * @returns {void}
     */
    setSearchPostTags: function() {
      var self = this;
      self.$results.find('span#search-post-tags').each(function() {
        $(this).click(function() {
          var tagName = $(this).text().trim();
          self.$searchInput.val(tagName);
          self.$searchInput.focus();
          self.searchWithAloglia(tagName);
        });
      });
    },

    setSearchDate: function() {
      var self = this;
      self.$results.find('span#search-post-date').each(function() {
        $(this).click(function() {
          var time = $(this).text().trim();
          self.$searchInput.val(time);
          self.$searchInput.focus();
          self.searchWithAloglia(time);
        });
      });
    },

    /**
     * set whitespace height
     * @returns {void}
     */
    setWhiteSpace: function() {
      var topWhitespaceHeight = this.$sidebarContainer.position().top;
      var bottomWhitespaceHeight = $(window).height() - this.$sidebarContainer.height() -
        topWhitespaceHeight;
      this.topWhitespace.css('height', topWhitespaceHeight + 'px');
      this.bottomWhitespace.css('height', bottomWhitespaceHeight + 'px');
    },

    /**
     * Open search modal and display overlay
     * @returns {void}
     */
    open: function() {
      this.showSearchToolsCol();
      this.ani();
      this.hideOverFlow();
    },

    /**
     * Close search modal and overlay
     * @returns {void}
     */
    close: function() {
      this.hideSearchToolsCol();
      this.recoverMainCol();
      this.recoverHeader();
      this.recoverPostHeaderCover();
      this.recoverPostBottomBar();
      this.showOverflow();
    },

    /**
     * handle search and display results
     * @returns {void}
     */
    handleSearch: function() {
      var self = this;
      self.$searchInput.on('input propertychange', function() {
        var val = $(this).val();
        self.searchWithAloglia(val);
      });
    },

    searchWithAloglia: function(val) {
      var self = this;
      this.algolia.search(val, function(err, content) {
        if (!err) {
          self.showResults(content.hits);
          self.showResultsCount(content.nbHits);
        }
      });
    },

    /**
     * Display results
     * @param {Array} posts
     * @returns {void}
     */
    showResults: function(posts) {
      var html = '';
      posts.forEach(function(post) {
        html += '<div class="media">';
        html += '<a class="search-title" href="' + post.path + '">';
        html += '<i class="fa fa-quote-left"></i>';
        html += '<span id="search-post-title">' + post.title + '</span>';
        html += '</a>';
        html += '<p class="search-time">';
        html += '<i class="fa fa-calendar"></i>';
        html += '<span id="search-post-date">' + post.date.substr(0, 10) + '</span>';
        html += '</p>';
        html += '<p class="search-result-meta">';
        html += '<i class="fa fa-tags"></i>';
        post.tags.forEach(function(tag) {
          html += '<span id="search-post-tags">';
          html += '#' + tag + ' ';
          html += '</span>';
        });

        html += '</p>';
        html += '<div class="clearfix"></div>';
        html += '</div>';
      });
      this.$results.html(html);
      this.setSearchPostTags();
      this.setSearchDate();
    },

    /**
     * Display messages and counts of results
     * @param {Number} count
     * @returns {void}
     */
    showResultsCount: function(count) {
      var string = '';
      if (count < 1) {
        string = this.$resultsCount.data('message-zero');
        this.$noResults.show();
      }
      else if (count === 1) {
        string = this.$resultsCount.data('message-one');
        this.$noResults.hide();
      }
      else if (count > 1) {
        string = this.$resultsCount.data('message-other').replace(/\{n\}/, count);
        this.$noResults.hide();
      }
      this.$resultsCount.html(string);
      if (this.$resultsCount.hasClass('hide')) {
        this.$resultsCount.removeClass('hide');
      }
    },

    removeHideClass: function() {
      if (this.$searchToolsCol.hasClass('hide')) {
        this.$searchToolsCol.removeClass('hide');
        this.$searchToolsCol.addClass('show');
      }
      if (this.$canvas.hasClass('hidden')) {
        this.$canvas.removeClass('hidden');
      }
    },

    /**
     * Show search modal
     * @returns {void}
     */
    showSearchToolsCol: function() {
      this.removeHideClass();
      this.thinMainCol();
      this.thinHeader();
      this.thinPostHeaderCover();
      this.thinBottomBar();
      this.$body.css('overflow-x', 'hidden');
    },

    /**
     * thin post bottom bar
     * @returns {void}
     */
    thinBottomBar: function() {
      this.$postBottomBar.addClass('show');
    },

    /**
     * thin post header cover
     * @returns {void}
     */
    thinPostHeaderCover: function() {
      this.$postHeaderCover.addClass('show');
      this.$postHeaderCover.removeClass('fade-in');
    },

    /**
     * thin post header cover
     * @returns {void}
     */
    recoverPostHeaderCover: function() {
      var self = this;
      if (this.$postHeaderCover.hasClass('show')) {
        this.$postHeaderCover.removeClass('show');
        this.$postHeaderCover.addClass('recover');
      }
      setTimeout(function() {
        self.$postHeaderCover.removeClass('recover');
      }, 1000);
    },

    /**
     * Hide search modal
     * @returns {void}
     */
    hideSearchToolsCol: function() {
      var self = this;
      if (this.$searchToolsCol.hasClass('show')) {
        this.$searchToolsCol.removeClass('show');
        this.$searchToolsCol.addClass('recover');
        setTimeout(function() {
          self.$searchToolsCol.removeClass('recover');
          self.$searchToolsCol.addClass('hide');
        }, 500);
      }
      if (!this.$canvas.hasClass('hidden')) {
        this.$canvas.addClass('hidden');
      }
    },

    /**
     * thin main col for search
     * @returns {void}
     */
    thinMainCol: function() {
      if (this.$main.hasClass('hide')) {
        this.$main.removeClass('hide');
      }
      if (!this.$main.hasClass('show')) {
        this.$main.addClass('show');
      }
    },

    /**
     * recover main col for search
     * @returns {void}
     */
    recoverMainCol: function() {
      var self = this;
      if (this.$main.hasClass('show')) {
        this.$main.removeClass('show');
        this.$main.addClass('recover');
      }
      setTimeout(function() {
        self.$main.removeClass('recover');
      }, 1000);
    },

    /**
     * thin header for search
     * @returns {void}
     */
    thinHeader: function() {
      if (!this.$header.hasClass('show')) {
        this.$header.addClass('show');
        this.$header.removeClass('fade-in');
      }
    },

    /**
     * recover header for search
     * @returns {void}
     */
    recoverHeader: function() {
      if (this.$header.hasClass('show')) {
        var self = this;
        this.$header.removeClass('show');
        this.$header.addClass('recover');
        setTimeout(function() {
          self.$header.removeClass('recover');
        }, 1000);
      }
    },

    /**
     * recover header for search
     * @returns {void}
     */
    recoverPostBottomBar: function() {
      if (this.$postBottomBar.hasClass('show')) {
        var self = this;
        this.$postBottomBar.removeClass('show');
        this.$postBottomBar.addClass('recover');
        setTimeout(function() {
          self.$postBottomBar.removeClass('recover');
        }, 1000);
      }
    },

    /**
     * show over flow
     * @returns {void}
     */
    hideOverFlow: function() {
      $('body').css('overflow', 'hidden');
    },

    /**
     * show over flow
     * @returns {void}
     */
    showOverflow: function() {
      var self = this;
      setTimeout(function() {
        if (self.$sidebar.hasClass('pushed')) {
          $('body').css({'overflow-x': 'hidden', 'overflow-y': 'auto'});
        } else {
          $('body').css('overflow', 'auto');
        }
      }, 1000);
    },

    /**
     * animation for search modal
     * @returns {void}
     */
    ani: function() {
      var self = this;
      var width;
      var height;
      var largeHeader;
      var canvas;
      var ctx;
      var circles;
      var target;
      var animateHeader = true;
      var sidebarWidth;

      // Main
      initHeader();
      addListeners();

      // initial for animation
      function initHeader() {
        target = {x: 0, y: height};

        drawCanvas();
        ctx = canvas.getContext('2d');
        createCircles();
        animate();
      }

      function createCircles() {
        // create particles
        circles = [];
        for (var x = 0; x < width * 0.5; x++) {
          var c = new Circle();
          circles.push(c);
        }
      }

      // Event handling
      function addListeners() {
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
      }

      function drawCanvas() {
        largeHeader = document.getElementById('container');
        canvas = document.getElementById('anm-canvas');

        sidebarWidth = $('#sidebar').width();
        width = window.innerWidth;
        height = window.innerHeight;

        largeHeader.style.height = height + 'px';

        canvas.height = height;
        canvas.width = width;
      }

      function scrollCheck() {
        if (document.body.scrollTop > height) {
          animateHeader = false;
        }
        else {
          animateHeader = true;
        }
      }

      function resize() {
        drawCanvas();
      }

      function animate() {
        if (animateHeader) {
          ctx.clearRect(0, 0, width, height);
          for (var i in circles) {
            circles[i].draw();
          }
        }
        requestAnimationFrame(animate);
      }

      // Canvas manipulation
      function Circle() {
        var _this = this;

        // constructor
        (function() {
          _this.pos = {};
          init();
          // console.log(_this);
        })();

        function init() {
          _this.pos.x = Math.random() * width;
          _this.pos.y = height + Math.random() * 100;
          _this.alpha = 0.1 + Math.random() * 0.3;
          _this.scale = 0.1 + Math.random() * 0.3;
          _this.velocity = Math.random();
        }

        this.draw = function() {
          if (_this.alpha <= 0) {
            init();
          }
          _this.pos.y -= _this.velocity;
          _this.alpha -= 0.0005;
          ctx.beginPath();
          ctx.arc(_this.pos.x, _this.pos.y, _this.scale * 10, 0, 2 * Math.PI, false);
          ctx.fillStyle = 'rgba(255,255,255,' + _this.alpha + ')';
          ctx.fill();
        };
      }
    }
  };

  $(document).ready(function() {
    var searchToolsColModal = new SearchToolsColModal();
    searchToolsColModal.run();
  });
})(jQuery);
;(function($) {
  'use strict';

  // Open and close the share options bar

  /**
   * ShareOptionsBar
   * @constructor
   */
  var ShareOptionsBar = function() {
    this.$shareOptionsBar = $('#share-options-bar');
    this.$openBtn = $('.btn-open-shareoptions');
    this.$closeBtn = $('#btn-close-shareoptions');
    this.$body = $('body');
  };

  ShareOptionsBar.prototype = {

    /**
     * Run ShareOptionsBar feature
     * @return {void}
     */
    run: function() {
      var self = this;

      // Detect the click on the open button
      self.$openBtn.click(function() {
        if (!self.$shareOptionsBar.hasClass('opened')) {
          self.openShareOptions();
          self.$closeBtn.show();
        }
      });

      // Detect the click on the close button
      self.$closeBtn.click(function() {
        if (self.$shareOptionsBar.hasClass('opened')) {
          self.closeShareOptions();
          self.$closeBtn.hide();
        }
      });
    },

    /**
     * Open share options bar
     * @return {void}
     */
    openShareOptions: function() {
      var self = this;

      // Check if the share option bar isn't opened
      // and prevent multiple click on the open button with `.processing` class
      if (!self.$shareOptionsBar.hasClass('opened') &&
        !this.$shareOptionsBar.hasClass('processing')) {
        // Open the share option bar
        self.$shareOptionsBar.addClass('processing opened');
        self.$body.css('overflow', 'hidden');

        setTimeout(function() {
          self.$shareOptionsBar.removeClass('processing');
        }, 250);
      }
    },

    /**
     * Close share options bar
     * @return {void}
     */
    closeShareOptions: function() {
      var self = this;

      // Check if the share options bar is opened
      // and prevent multiple click on the close button with `.processing` class
      if (self.$shareOptionsBar.hasClass('opened') &&
        !this.$shareOptionsBar.hasClass('processing')) {
        // Close the share option bar
        self.$shareOptionsBar.addClass('processing').removeClass('opened');

        setTimeout(function() {
          self.$shareOptionsBar.removeClass('processing');
          self.$body.css('overflow', '');
        }, 250);
      }
    }
  };

  $(document).ready(function() {
    var shareOptionsBar = new ShareOptionsBar();
    shareOptionsBar.run();
  });
})(jQuery);
;(function($) {
  'use strict';

  // Open and close the sidebar by swiping the sidebar and the blog and vice versa

  /**
   * Sidebar
   * @constructor
   */
  var Sidebar = function() {
    this.$sidebar = $('#sidebar');
    this.$openBtn = $('#btn-open-sidebar');
    this.$searchToolsCol = $('.search-tools-col');
    // Elements where the user can click to close the sidebar
    this.$closeBtn = $('#main, .post-header-cover');
    // Elements affected by the swipe of the sidebar
    // The `pushed` class is added to each elements
    // Each element has a different behavior when the sidebar is opened
    this.$blog = $('.post-bottom-bar, #header, #main, .post-header-cover');
    // If you change value of `mediumScreenWidth`,
    // you have to change value of `$screen-min: (md-min)` too
    // in `source/_css/utils/variables.scss`
    this.$body = $('body');
    this.$main = $('#main');
    this.$canvas = $('.anm-canvas');
    this.$headProfile = $('.full-screen-head');
    this.mediumScreenWidth = 768;
  };

  Sidebar.prototype = {
    /**
     * Run Sidebar feature
     * @return {void}
     */
    run: function() {
      var self = this;
      // Detect the click on the open button
      this.$openBtn.click(function() {
        if (!self.$sidebar.hasClass('pushed')) {
          // hide the picture in full screen
          self.openSidebar();
        }
      });
      // Detect the click on close button
      this.$closeBtn.click(function() {
        if (self.$sidebar.hasClass('pushed')) {
          self.closeSidebar();
        }
      });
      // Detect resize of the windows
      $(window).resize(function() {
        // Check if the window is larger than the minimal medium screen value
        if ($(window).width() > self.mediumScreenWidth) {
          self.resetSidebarPosition();
          self.resetBlogPosition();
        }
        else {
          self.closeSidebar();
        }
        self.resetSearchToolsCol();
      });
    },

    /**
     * Open the sidebar by swiping to the right the sidebar and the blog
     * @return {void}
     */
    openSidebar: function() {
      this.removeMainHideClass();
      this.swipeBlogToRight();
      this.swipeSidebarToRight();
      this.pushSearchToolsCol();
      this.pushAniCanvas();
    },

    /**
     * push ani-canvas
     * @returns {void}
     */
    pushAniCanvas: function() {
      if (!this.$searchToolsCol.hasClass('hidden')) {
        this.$canvas.addClass('pushed');
      }
    },

    /**
     * remove hide class for main
     * @return {void}
     */
    removeMainHideClass: function() {
      this.$main.removeClass('hide');
    },

    /**
     * Close the sidebar by swiping to the left the sidebar and the blog
     * @return {void}
     */
    closeSidebar: function() {
      if (this.$searchToolsCol.hasClass('hide')) {
        this.swipeSidebarToLeft();
        this.swipeBlogToLeft();
        this.removeCanvasPushed();
        this.resetSearchToolsCol();
      }
    },

    /**
     * remove class 'pushed' for canvas
     * @returns {void}
     */
    removeCanvasPushed: function() {
      this.$canvas.removeClass('pushed');
    },

    /**
     * Reset sidebar position
     * @return {void}
     */
    resetSidebarPosition: function() {
      this.$sidebar.removeClass('pushed');
    },

    /**
     * Reset blog position
     * @return {void}
     */
    resetBlogPosition: function() {
      this.$blog.removeClass('pushed');
    },

    /**
     * Reset search tools col position
     * @return {void}
     */
    resetSearchToolsCol: function() {
      if (this.$searchToolsCol.hasClass('pushed')) {
        this.$searchToolsCol.removeClass('pushed');
      }
    },
    /**
     * Swipe the sidebar to the right
     * @return {void}
     */
    swipeSidebarToRight: function() {
      var self = this;
      // Check if the sidebar isn't swiped
      // and prevent multiple click on the open button with `.processing` class
      if (!this.$sidebar.hasClass('pushed') && !this.$sidebar.hasClass('processing')) {
        // Swipe the sidebar to the right
        this.$sidebar.addClass('processing pushed');
        // add overflow on body to remove horizontal scroll
        this.$body.css('overflow-x', 'hidden');
        setTimeout(function() {
          self.$sidebar.removeClass('processing');
        }, 250);
      }
    },

    /**
     * push the search tools col when sidebar pushed
     * @return {void}
     */
    pushSearchToolsCol: function() {
      if (!this.$searchToolsCol.hasClass('pushed')) {
        this.$searchToolsCol.addClass('pushed');
      }
    },

    /**
     * Swipe the sidebar to the left
     * @return {void}
     */
    swipeSidebarToLeft: function() {
      // Check if the sidebar is swiped
      // and prevent multiple click on the close button with `.processing` class
      if (this.$sidebar.hasClass('pushed') && !this.$sidebar.hasClass('processing')) {
        // Swipe the sidebar to the left
        var self = this;
        this.$sidebar.addClass('processing').removeClass('pushed processing');
        // go back to the default overflow
        setTimeout(function() {
          self.$body.css('overflow-x', 'auto');
        }, 250);
      }
    },

    /**
     * Swipe the blog to the right
     * @return {void}
     */
    swipeBlogToRight: function() {
      var self = this;
      // Check if the blog isn't swiped
      // and prevent multiple click on the open button with `.processing` class
      if (!this.$blog.hasClass('pushed') && !this.$blog.hasClass('processing')) {
        // Swipe the blog to the right
        this.$blog.addClass('processing pushed');

        setTimeout(function() {
          self.$blog.removeClass('processing');
        }, 250);
      }
    },

    /**
     * Swipe the blog to the left
     * @return {void}
     */
    swipeBlogToLeft: function() {
      var self = this;
      // Check if the blog is swiped
      // and prevent multiple click on the close button with `.processing` class
      if (self.$blog.hasClass('pushed') && !this.$blog.hasClass('processing')) {
        // Swipe the blog to the left
        self.$blog.addClass('processing').removeClass('pushed');

        setTimeout(function() {
          self.$blog.removeClass('processing');
        }, 250);
      }
    }
  };

  $(document).ready(function() {
    var sidebar = new Sidebar();
    sidebar.run();
  });
})(jQuery);
;(function($, sr) {
  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function(func, threshold, execAsap) {
    var timeout;

    return function debounced() {
      var obj = this;
      var args = arguments;

      function delayed() {
        if (!execAsap) {
          func.apply(obj, args);
        }

        timeout = null;
      }

      if (timeout) {
        clearTimeout(timeout);
      }
      else if (execAsap) {
        func.apply(obj, args);
      }

      timeout = setTimeout(delayed, threshold || 100);
    };
  };

  jQuery.fn[sr] = function(fn) {
    return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
  };
})(jQuery, 'smartresize');
;(function($) {
  'use strict';

  // Animate tabs of tabbed code blocks

  /**
   * TabbedCodeBlock
   * @param {String} elems
   * @constructor
   */
  var TabbedCodeBlock = function(elems) {
    this.$jsFixedContent = $(elems);
  };

  TabbedCodeBlock.prototype = {
    /**
     * Run TabbedCodeBlock feature
     * @return {void}
     */
    run: function() {
      var self = this;
      self.$jsFixedContent.find('.tab').click(function() {
        var $codeblock = $(this).parent().parent().parent();
        var $tabsContent = $codeblock.find('.tabs-content').children('pre, .highlight');
        // remove `active` css class on all tabs
        $(this).siblings().removeClass('active');
        // add `active` css class on the clicked tab
        $(this).addClass('active');
        // hide all tab contents
        $tabsContent.hide();
        // show only the right one
        $tabsContent.eq($(this).index()).show();
      });
    }
  };

  $(document).ready(function() {
    var tabbedCodeBlocks = new TabbedCodeBlock('.codeblock--tabbed');
    tabbedCodeBlocks.run();
  });
})(jQuery);
;/* eslint-disable brace-style,max-len */
(function($) {
  'use strict';

  /**
   * TableContent
   * @constructor
   */
  var TableContent = function() {
    this.$postContent = $('.post-content');
    this.post = $('.post');
    this.$ulToc = this.$postContent.find('ul.toc');
    this.$tableTile = this.post.find('.tableTile');
    this.$tableContent = this.$postContent.find('.tableContent');
    this.$contentWrap = this.$postContent.find('.toc.main-content-wrap');
    this.tocMessage = this.$tableTile.data('message');
  };

  TableContent.prototype = {
    /**
     * Run toc feature
     * @return {void}
     */
    run: function() {
      var tocContent = '';
      var title = '<li>' + this.tocMessage + '</li>';
      var icon = '<i class="fa fa-chevron-right">';
      var selfOut = this;
      this.$tableTile.detach();
      this.$ulToc.detach();
      this.$ulToc.find('ul').each(function() {
        var liBlock = $(this).parent('li');
        $(liBlock).prepend(icon);
        if ($(liBlock).css('padding-left') !== '20px') {
          $(liBlock).css('padding-left', '20px');
        }
        var selfIn = this;
        var count = 0;
        selfOut.toggleContent(this, 20);
        $(liBlock).find('.fa').click(function() {
          selfOut.toggleContent(selfIn, 250);
          if (count % 2 === 0) {
            $(liBlock).find('i').removeClass('fa-chevron-right').addClass('fa-chevron-down');
            count++;
          } else {
            $(liBlock).find('i').removeClass('fa-chevron-down').addClass('fa-chevron-right');
            count = 0;
          }
        });
      });

      this.$ulToc.prepend(title);
      if (this.$tableContent.length) {
        tocContent = this.$ulToc[0];
        this.$ulToc.detach();
        this.$tableContent.prepend(tocContent);
        this.$tableContent.insertBefore(this.$contentWrap);
      } else {
        this.$ulToc.removeClass('js-fixedContent');
        tocContent = this.$ulToc[0];
        this.$contentWrap.prepend(tocContent);
      }
    },

    toggleContent: function(element, time) {
      $(element).slideToggle(time);
    }
  };

  $(document).ready(function() {
    var toc = new TableContent();
    toc.run();
  });
})(jQuery);
;(function($) {
  'use strict';

  // Filter posts by using their categories on categories page : `/categories`

  /**
   * TagsFilter
   * @param {String} tagsArchivesElem
   * @constructor
   */
  var TagsFilter = function(tagsArchivesElem) {
    this.$form = $(tagsArchivesElem).find('#filter-form');
    this.$inputSearch = $(tagsArchivesElem + ' #filter-form input[name=tag]');
    this.$archiveResult = $(tagsArchivesElem).find('.archive-result');
    this.$tags = $(tagsArchivesElem).find('.tag');
    this.$posts = $(tagsArchivesElem).find('.archive');
    this.tags = tagsArchivesElem + ' .tag';
    this.posts = tagsArchivesElem + ' .archive';
    // Html data attribute without `data-` of `.archive` element which contains the name of tag
    this.dataTag = 'tag';
    this.messages = {
      zero: this.$archiveResult.data('message-zero'),
      one: this.$archiveResult.data('message-one'),
      other: this.$archiveResult.data('message-other')
    };
  };

  TagsFilter.prototype = {
    /**
     * Run TagsFilter feature
     * @return {void}
     */
    run: function() {
      var self = this;

      // Detect keystroke of the user
      self.$inputSearch.keyup(function() {
        self.filter(self.getSearch());
      });

      // Block submit action
      self.$form.submit(function(e) {
        e.preventDefault();
      });
    },

    /**
     * Get the search entered by user
     * @returns {String} the name of tag entered by the user
     */
    getSearch: function() {
      return this.$inputSearch.val().toLowerCase();
    },

    /**
     * Show related posts form a tag and hide the others
     * @param {String} tag - name of a tag
     * @return {void}
     */
    filter: function(tag) {
      if (tag === '') {
        this.showAll();
        this.showResult(-1);
      }
      else {
        this.hideAll();
        this.showPosts(tag);
        this.showResult(this.countTags(tag));
      }
    },

    /**
     * Display results of the search
     * @param {Number} numbTags - Number of tags found
     * @return {void}
     */
    showResult: function(numbTags) {
      if (numbTags === -1) {
        this.$archiveResult.html('').hide();
      }
      else if (numbTags === 0) {
        this.$archiveResult.html(this.messages.zero).show();
      }
      else if (numbTags === 1) {
        this.$archiveResult.html(this.messages.one).show();
      }
      else {
        this.$archiveResult.html(this.messages.other.replace(/\{n\}/, numbTags)).show();
      }
    },

    /**
     * Count number of tags
     * @param {String} tag
     * @returns {Number}
     */
    countTags: function(tag) {
      return $(this.posts + '[data-' + this.dataTag + '*=\'' + tag + '\']').length;
    },

    /**
     * Show all posts from a tag
     * @param {String} tag - name of a tag
     * @return {void}
     */
    showPosts: function(tag) {
      $(this.tags + '[data-' + this.dataTag + '*=\'' + tag + '\']').show();
      $(this.posts + '[data-' + this.dataTag + '*=\'' + tag + '\']').show();
    },

    /**
     * Show all tags and all posts
     * @return {void}
     */
    showAll: function() {
      this.$tags.show();
      this.$posts.show();
    },

    /**
     * Hide all tags and all posts
     * @return {void}
     */
    hideAll: function() {
      this.$tags.hide();
      this.$posts.hide();
    }
  };

  $(document).ready(function() {
    if ($('#tags-archives').length) {
      var tagsFilter = new TagsFilter('#tags-archives');
      tagsFilter.run();
    }
  });
})(jQuery);
