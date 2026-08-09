/**
* Template Name: Personal - v2.2.0
* Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
!(function($) {
  "use strict";

  // ---- Theme Toggle ----
  (function initThemeToggle() {
    var html = document.documentElement;
    var saved = localStorage.getItem('theme');
    if (saved) {
      html.setAttribute('data-theme', saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      html.setAttribute('data-theme', 'light');
    }
    // dark is the default (no attribute needed), but set explicitly for clarity
    if (!html.getAttribute('data-theme')) {
      html.setAttribute('data-theme', 'dark');
    }

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function() {
        var current = html.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      });
    }
  })();
  location.pathname.replace(/index.html/, "");

  // Nav Menu
  $(document).on('click', '.nav-menu a, .mobile-nav a', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var hash = this.hash;
      var target = $(hash);
      if (target.length) {
        e.preventDefault();

        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if (hash == '#header') {
          $('#header').removeClass('header-top');
          $("section").removeClass('section-show');
          return;
        }

        if (!$('#header').hasClass('header-top')) {
          $('#header').addClass('header-top');
          setTimeout(function() {
            $("section").removeClass('section-show');
            $(hash).addClass('section-show');
          }, 350);
        } else {
          $("section").removeClass('section-show');
          $(hash).addClass('section-show');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }

        return false;

      }
    }
  });

  // Activate/show sections on load with hash links.
  // The portfolio section is shown by default (see the markup), so only act on
  // a hash that points at a different section.
  if (window.location.hash) {
    var initial_nav = window.location.hash;
    if ($(initial_nav).is('section') && !$(initial_nav).hasClass('section-show')) {
      $('.nav-menu .active, .mobile-nav .active').removeClass('active');
      $('.nav-menu, .mobile-nav').find('a[href="' + initial_nav + '"]').parent('li').addClass('active');
      $("section").removeClass('section-show');
      $(initial_nav).addClass('section-show');
    }
  }

  // Mobile Navigation
  if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none" aria-label="Toggle menu"><svg class="icon" aria-hidden="true"><use href="#i-menu"></use></svg></button>');
    $('body').append('<div class="mobile-nav-overly"></div>');

    // Swaps the sprite reference rather than a font class.
    function setToggleIcon(open) {
      $('.mobile-nav-toggle use').attr('href', open ? '#i-close' : '#i-menu');
    }

    $(document).on('click', '.mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      setToggleIcon($('body').hasClass('mobile-nav-active'));
      $('.mobile-nav-overly').toggle();
    });

    $(document).click(function(e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          setToggleIcon(false);
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });

  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }

  // Initiate venobox (lightbox feature used in portofilo)
  $(document).ready(function() {
    // The demo clips are inline <video> items. They carry preload="none" and no
    // autoplay attribute on purpose: autoplay would make every hidden source
    // download on page load, which is exactly the cost this replaced. Start
    // them once the lightbox has actually put one on screen.
    function playLightboxVideo() {
      var video = document.querySelector('.vbox-inline video');
      if (!video) {
        return;
      }

      // VenoBox centres the panel from the content height it measures at open
      // time. A preload="none" video has no dimensions yet, so it measures an
      // empty box and the panel lands too low. Its updateOL() re-runs on window
      // resize, so nudge it once the real size is known.
      video.addEventListener('loadedmetadata', function() {
        $(window).trigger('resize');
      }, { once: true });

      video.muted = true;
      var started = video.play();
      if (started && started.catch) {
        started.catch(function() {});
      }
    }

    $('.venobox').venobox({
      'share': false,
      'spinner': 'cube-grid',
      // VenoBox paints the content panel white via an inline style, which a
      // stylesheet cannot override. Video needs no backdrop of its own.
      'bgcolor': 'transparent',
      'cb_post_open': playLightboxVideo,
      'cb_after_nav': playLightboxVideo
    });
  });



  // CTA button click handler
  $(document).on('click', '.cta-btn', function(e) {
    e.preventDefault();
    var hash = this.getAttribute('href');
    var target = $(hash);
    if (target.length) {
      if (!$('#header').hasClass('header-top')) {
        $('#header').addClass('header-top');
        setTimeout(function() {
          $("section").removeClass('section-show');
          $(hash).addClass('section-show');
          $('.nav-menu').show();
        }, 350);
      } else {
        $("section").removeClass('section-show');
        $(hash).addClass('section-show');
        $('.nav-menu').show();
      }
    }
  });

  // Intersection Observer for portfolio card fade-in animations
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry, index) {
        if (entry.isIntersecting) {
          // Add staggered delay, capped so the first screenful fills in quickly
          var position = Array.prototype.indexOf.call(
            entry.target.parentElement.children,
            entry.target
          );
          var delay = Math.min(position, 5) * 60;
          setTimeout(function() {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Observe portfolio items when sections become visible
    var portfolioObserver = new MutationObserver(function() {
      document.querySelectorAll('.portfolio-item').forEach(function(item) {
        if (!item.classList.contains('fade-in')) {
          item.classList.add('fade-in');
          observer.observe(item);
        }
      });
    });

    portfolioObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  }

  // Grid preview videos hold their source in data-src: <video> has no
  // loading="lazy", so without this every card below the fold would fetch a
  // few hundred KB the visitor may never scroll to. The poster carries the
  // card until the source is attached.
  (function initLazyPreviewVideos() {
    var videos = document.querySelectorAll('video.preview-video[data-src]');
    if (!videos.length) {
      return;
    }

    function load(video) {
      if (!video.dataset.src) {
        return;
      }
      video.src = video.dataset.src;
      delete video.dataset.src;
      var started = video.play();
      // Autoplay can still be refused (data saver, reduced motion); the poster
      // stays put and the controls-free card simply does not animate.
      if (started && started.catch) {
        started.catch(function() {});
      }
    }

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(videos, load);
      return;
    }

    var videoObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          load(entry.target);
          videoObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px' });

    Array.prototype.forEach.call(videos, function(video) {
      videoObserver.observe(video);
    });
  })();

})(jQuery);