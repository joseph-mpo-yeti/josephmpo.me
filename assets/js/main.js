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
      // Horizontally the margin is a full viewport, so the neighbouring slide
      // on the desktop rail is already loading by the time it is swiped to.
      // 200px is plenty vertically, where the mobile grid scrolls.
    }, { rootMargin: '200px 100%' });

    Array.prototype.forEach.call(videos, function(video) {
      videoObserver.observe(video);
    });
  })();

  // Horizontal project rail, desktop only.
  //
  // The rail itself is CSS: from 992px up the portfolio section becomes a
  // scroll-snap container and display:contents flattens the group wrappers so
  // all 23 cards sit on one line. That means trackpad and touch already work,
  // and the markup below 992px is untouched. This adds the affordances CSS
  // cannot: arrows, dots, a counter, keyboard, and pointer drag.
  (function initProjectRail() {
    var rail = document.getElementById('portfolio');
    var items = rail ? rail.querySelectorAll('.portfolio-item') : [];
    if (!rail || !items.length) {
      return;
    }

    // Must stay in step with the rail's media query in style.css.
    var desktop = window.matchMedia('(min-width: 992px) and (orientation: landscape)');
    var index = 0;

    var controls = document.createElement('div');
    controls.className = 'rail-controls';
    controls.innerHTML =
      '<button type="button" class="rail-arrow rail-prev" aria-label="Previous project">' +
        '<svg class="icon" aria-hidden="true"><use href="#i-chevron-left"></use></svg></button>' +
      '<button type="button" class="rail-arrow rail-next" aria-label="Next project">' +
        '<svg class="icon" aria-hidden="true"><use href="#i-chevron-right"></use></svg></button>' +
      '<div class="rail-status"><div class="rail-dots"></div>' +
        '<span class="rail-count" aria-live="polite"></span></div>';
    document.body.appendChild(controls);

    var prev = controls.querySelector('.rail-prev');
    var next = controls.querySelector('.rail-next');
    var dotWrap = controls.querySelector('.rail-dots');
    var count = controls.querySelector('.rail-count');

    var dots = Array.prototype.map.call(items, function(item, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'rail-dot';
      var name = item.querySelector('h4');
      dot.setAttribute('aria-label', name ? name.textContent : 'Project ' + (i + 1));
      dot.addEventListener('click', function() {
        goTo(i);
      });
      dotWrap.appendChild(dot);
      return dot;
    });

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var animation = null;
    var safety = null;
    var animating = false;

    function jump(left) {
      rail.scrollLeft = left;
    }

    function stopAnimation() {
      if (animation !== null) {
        window.cancelAnimationFrame(animation);
        animation = null;
      }
      if (safety !== null) {
        window.clearTimeout(safety);
        safety = null;
      }
      animating = false;
      rail.style.scrollSnapType = '';
    }

    // Hand-rolled rather than scrollTo({behavior:'smooth'}), which silently
    // does nothing on a snap container in some engines. Snapping is suspended
    // for the duration so it does not fight the animation frame by frame.
    function glide(left) {
      var from = rail.scrollLeft;
      var distance = left - from;
      if (!distance) {
        return;
      }
      var start = null;
      var duration = 420;

      animating = true;
      rail.style.scrollSnapType = 'none';

      function frame(now) {
        if (start === null) {
          start = now;
        }
        var t = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - t, 3);
        rail.scrollLeft = from + distance * eased;
        if (t < 1) {
          animation = window.requestAnimationFrame(frame);
          return;
        }
        stopAnimation();
      }

      animation = window.requestAnimationFrame(frame);

      // Animation frames stop in a hidden tab. Without this the rail would be
      // stranded mid-move, showing a slide the counter disagrees with, so the
      // destination is guaranteed whether or not the frames ever arrive.
      safety = window.setTimeout(function() {
        if (animating) {
          stopAnimation();
          jump(left);
        }
      }, duration + 150);
    }

    function goTo(i, instant) {
      var target = Math.max(0, Math.min(items.length - 1, i));
      // Animating across twenty screens is a long whip-pan that tells the
      // visitor nothing, so only neighbouring moves glide.
      var far = Math.abs(target - index) > 2;
      var left = target * rail.clientWidth;

      stopAnimation();
      index = target;
      if (instant || far || reduceMotion.matches) {
        jump(left);
      } else {
        glide(left);
      }
      render();
    }

    function render() {
      count.textContent = (index + 1) + ' / ' + items.length;
      prev.disabled = index === 0;
      next.disabled = index === items.length - 1;
      dots.forEach(function(dot, i) {
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }

    prev.addEventListener('click', function() { goTo(index - 1); });
    next.addEventListener('click', function() { goTo(index + 1); });

    // Scroll is the source of truth: trackpad, drag and scrollTo all land here.
    var ticking = false;
    rail.addEventListener('scroll', function() {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(function() {
        ticking = false;
        // While gliding, goTo already knows where it is heading; reading the
        // in-between position back would just flicker the counter.
        if (animating || !rail.clientWidth) {
          return;
        }
        var current = Math.round(rail.scrollLeft / rail.clientWidth);
        if (current !== index) {
          index = current;
          render();
        }
      });
    }, { passive: true });

    document.addEventListener('keydown', function(e) {
      if (!document.body.classList.contains('rail-active')) {
        return;
      }
      // Leave the lightbox and any text entry alone.
      if (document.querySelector('.vbox-overlay') ||
          /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) ||
          e.target.isContentEditable || e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }
      var moves = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: items.length - 1 };
      if (e.key in moves) {
        e.preventDefault();
        goTo(moves[e.key]);
      }
    });

    // Pointer drag. Movement only counts as a drag past a threshold, so a
    // click on a lightbox link still reads as a click.
    var THRESHOLD = 6;
    var dragging = false;
    var startX = 0;
    var startScroll = 0;
    var pointerId = null;

    rail.addEventListener('pointerdown', function(e) {
      if (e.pointerType === 'touch' || e.button !== 0 || !desktop.matches) {
        return;
      }
      pointerId = e.pointerId;
      startX = e.clientX;
      startScroll = rail.scrollLeft;
      dragging = false;
    });

    rail.addEventListener('pointermove', function(e) {
      if (e.pointerId !== pointerId) {
        return;
      }
      var dx = e.clientX - startX;
      if (!dragging && Math.abs(dx) < THRESHOLD) {
        return;
      }
      if (!dragging) {
        dragging = true;
        document.body.classList.add('rail-dragging');
        try {
          rail.setPointerCapture(pointerId);
        } catch (err) {
          // Capture is a nicety for pointers that leave the element; losing it
          // must not take the drag itself down with it.
        }
      }
      rail.scrollLeft = startScroll - dx;
    });

    function endDrag(e) {
      if (e.pointerId !== pointerId) {
        return;
      }
      if (dragging) {
        // Snap to whichever slide the release landed nearest.
        document.body.classList.remove('rail-dragging');
        goTo(Math.round(rail.scrollLeft / rail.clientWidth));
      }
      try {
        if (rail.hasPointerCapture && rail.hasPointerCapture(pointerId)) {
          rail.releasePointerCapture(pointerId);
        }
      } catch (err) {
        // Already released.
      }
      pointerId = null;
      dragging = false;
    }

    rail.addEventListener('pointerup', endDrag);
    rail.addEventListener('pointercancel', endDrag);

    // The controls belong to the rail, so they follow both the breakpoint and
    // whether the portfolio section is the one on screen.
    function sync() {
      var active = desktop.matches && rail.classList.contains('section-show');
      document.body.classList.toggle('rail-active', active);
      if (active) {
        render();
      }
    }

    new MutationObserver(sync).observe(rail, { attributes: true, attributeFilter: ['class'] });
    desktop.addEventListener('change', function() {
      // Leaving the breakpoint returns the grid; reset so the rail reopens at
      // the first project rather than a stale scroll offset.
      rail.scrollLeft = 0;
      index = 0;
      sync();
    });
    window.addEventListener('resize', function() {
      sync();
      if (desktop.matches && document.body.classList.contains('rail-active')) {
        rail.scrollLeft = index * rail.clientWidth;
      }
    });

    // sync() reads the viewport, so run it again once layout has settled:
    // evaluated too early it can decide the rail is inactive and, with no
    // class change to observe afterwards, never reconsider.
    window.addEventListener('load', sync);
    sync();
  })();

})(jQuery);