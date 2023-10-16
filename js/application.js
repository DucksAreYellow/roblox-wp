/*!
 * jQuery JavaScript Library v1.11.3
 * http://jquery.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-04-28T16:19Z
 */

$(function () {
  var isTouch = $("html").hasClass("touch");
  var isSpanish = $("body").hasClass("page-template-page-es");
  var isIntroComplete;
  var isWindowInit = false;
  var currentScrollPosition,
    lastScrollPoistion = 0;
  var winMaxScroll;
  var winScrollTop;
  var winHeight;
  var winScrollTopWithHeight;

  var aniDur = 300;
  var numAniDur = 3000;
  var isFirstCheck = true;
  var heroRatio = 0.5625;
  var maxMobileHeight = 432;
  var isHome =
    $(".page-template-page-home").length > 0 ||
    $(".page-template-page-es").length > 0 ||
    $(".page-template-page-careers").length > 0 ||
    $(".page-template-page-careers-v2").length > 0;
  var isCareer =
    $(".page-template-page-career").length > 0 ||
    $(".page-template-page-careers").length > 0 ||
    $(".page-template-page-careers-v2").length > 0;

  // Setup Vimeo player
  var vimeo_player;
  var videoElem;
  var is_mp4_video_playing = false;

  // Setup YouTube player
  var player;
  var tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  var is320;
  var is568;
  var is768;
  var is968;
  var is1024;
  var is1200;
  var is1600;

  function initWindow() {
    isWindowInit = true;

    initAnimatedNumbers();

    $(window).on("resize load", resizeUI);
    $(window).bind("orientationchange", function () {
      $("body").trigger("resizeDOM");
    });

    // Window Scrolling
    $("html, body").bind(
      "DOMMouseScroll mousewheel keyup load",
      windowScrolled
    );
    $(window).scroll(windowScrolled);

    $(window).unload(function (e) {
      $("html").hide();
      $("body").remove();
    });

    // Nav Scrolling
    $("a[href*=#]:not([href=#], a[href*=#]:not([href=#main-content])").click(
      function () {
        if (
          location.pathname.replace(/^\//, "") ==
            this.pathname.replace(/^\//, "") &&
          location.hostname == this.hostname
        ) {
          var target = $(this.hash);

          target = target.length
            ? target
            : $("[name=" + this.hash.slice(1) + "]");
          if (target.length && target.selector != "#open_positions") {
            hideMenu();
            isAnimating = true;
            $("#header").addClass("hide");
            $("html,body").animate(
              {
                scrollTop: target.offset().top + 1,
              },
              1000,
              function () {
                windowScrolled();
                isAnimating = false;
              }
            );
            return false;
          }
        }
      }
    );

    $("body").addClass("fade");
    setTimeout(checkFade, 500);

    $(".news-list").bind("DOMSubtreeModified", function () {
      checkFade();
    });

    // Toggle the main nav
    $(".hamburger").click(function () {
      var body = $("body");
      body.toggleClass("nav-active");
      if (body.hasClass("nav-active")) {
        showMenu();
      } else {
        hideMenu();
      }
    });
    $(".language-switcher .globe").click(function (e) {
      e.preventDefault();
      var body = $("body");
      body.toggleClass("language-nav-active");
      if (body.hasClass("language-nav-active")) {
        showLanguageMenu();
      } else {
        hideLanguageMenu();
      }
      return false;
    });

    $(".menu-main-menu li a").click(function (event) {
      event.stopPropagation();
      hideMenu();
      return false;
    });

    // Toggle the expanding content
    $(".btn-toggle").click(function () {
      var block = $(this).closest(".expanding-block");
      var sub = block.find(".sub");
      var closebtn = block.find(".close");
      var openbtn = block.find(".read-more");

      block.toggleClass("open");
      if (block.hasClass("open")) {
        sub.attr("aria-hidden", false);
        sub.css("visibility", "visible");
        closebtn.attr("aria-hidden", false);
        closebtn.attr("tabindex", 0);
        openbtn.attr("aria-hidden", true);
        openbtn.attr("aria-expanded", true);
        openbtn.attr("tabindex", -1);
        closebtn.addClass("close-open").removeClass("close-close");
        openbtn.addClass("read-more-close").removeClass("read-more-open");

        // only fade in if not mobile
        if (is1024) {
          block.find(".subimg").hide().delay(250).fadeIn();
        }

        sub.stop().animate(
          {
            height: getHeightByChildren(sub),
            easing: "easeInOutQuint",
          },
          500,
          function () {}
        );
      } else {
        sub.attr("aria-hidden", true);
        closebtn.attr("aria-hidden", true);
        openbtn.attr("aria-hidden", false);
        closebtn.attr("tabindex", -1);
        openbtn.attr("tabindex", 0);
        closebtn.addClass("close-close").removeClass("close-open");
        openbtn.addClass("read-more-open").removeClass("read-more-close");
        openbtn.attr("aria-expanded", false);

        block.find(".subimg").stop().fadeOut(250);

        sub.stop().animate(
          {
            height: 0,
            easing: "easeInOutQuint",
          },
          500,
          function () {
            sub.css("visibility", "hidden");
          }
        );
      }
    });

    // Toggle the expanding content
    $(".expanding-block .btn-w-border").click(function () {
      var block = $(this).closest(".expanding-block");
      var sub = block.find(".sub");
      var isTechBlock =
        $(this).closest(".tech-block").length > 0 ? true : false;

      block.toggleClass("open");
      if (block.hasClass("open")) {
        sub.attr("tabindex", 0);

        // only fade in if not mobile
        if (is1024) {
          block.find(".subimg").hide().delay(250).fadeIn();
        }

        sub.stop().animate(
          {
            height: getHeightByChildren(sub),
            easing: "easeInOutQuint",
          },
          500,
          function () {}
        );

        if (isTechBlock) {
          $(this).text(CLOSE_CTA);
        }
      } else {
        sub.attr("tabindex", -1);
        block.find(".subimg").stop().fadeOut(250);

        sub.stop().animate(
          {
            height: 0,
            easing: "easeInOutQuint",
          },
          500,
          function () {}
        );

        if (isTechBlock) {
          $(this).text(LEARN_MORE_CTA);
        }
      }
    });

    // Toggle the shown news articles
    $(".switch").click(function () {
      $(this).closest("ul").find(".switch").removeClass("active");
      $(this).addClass("active");
    });

    $(".switch.all").click(function () {
      $(".news-list").removeClass("show-roblox");
      $(".news-list").removeClass("show-press");
    });

    $(".switch.press").click(function () {
      $(".news-list").removeClass("show-roblox");
      $(".news-list").addClass("show-press");
    });

    $(".switch.roblox").click(function () {
      $(".news-list").removeClass("show-press");
      $(".news-list").addClass("show-roblox");
    });

    $(".careers .switch").click(function () {
      updateCareersNav($(this));
    });

    //$('.careers .switch').first().trigger('click');

    $(".contact-form input")
      .focus(function () {
        $(this).closest("fieldset").addClass("active");
      })
      .blur(function () {
        $(this).closest("fieldset").removeClass("active");
      });

    $(".contact-form select")
      .focus(function () {
        $(this).closest("fieldset").addClass("active");
      })
      .blur(function () {
        $(this).closest("fieldset").removeClass("active");
      });

    // set current menu item
    var catID = getURLParameter("cat_id");

    if (catID) {
      var obj = $("span." + catID).first();
      obj.trigger("click");
    }

    // chosen select
    $(".tour select")
      .chosen({
        disable_search_threshold: 10,
        no_results_text: "Oops, nothing found!",
        width: "100%",
      })
      .change(function () {
        if ($(this).val()) {
          $(this).closest("fieldset").find(".search-field").hide();
        } else {
          $(this).closest("fieldset").find(".search-field").show();
        }
      });

    // Init Country selector
    $(".featured-education-programs select")
      .chosen({
        disable_search_threshold: 10,
        disable_search: true,
        no_results_text: "Oops, nothing found!",
        width: "100%",
      })
      .change(function () {
        if ($(this).val()) {
          var country = $(this).val();
          filterCountry(country);
        } else {
          resetCountryFilter();
        }
      });
    $(".select-wrap.filter").on("keyup", function (e) {
      if (e.keyCode == "13") {
        $(".featured-education-programs select").trigger("chosen:open");
      }
    });

    $("select#cat")
      .chosen({
        disable_search_threshold: 10,
        disable_search: true,
        no_results_text: "Oops, nothing found!",
        width: "100%",
      })
      .change(function () {
        if ($(this).val()) {
          var country = $(this).val();
          filterCountry(country);
        } else {
          resetCountryFilter();
        }
      });

    $(".filters .select-wrap").on("keyup", function (e) {
      if (e.keyCode == "13") {
        $("select#cat").trigger("chosen:open");
      }
    });

    //Home Page video
    if (!$("body").hasClass("roblox-blog")) {
      // $('.page-template-page-home .hero-block.home, .page-template-page-es .hero-block.home').click(function(e) {
      //   e.preventDefault();
      //   var vidID = $(this).attr('data-src');
      //   showHeroVideo(vidID);
      //   return false;
      // });

      $(".hero-block.about-film").click(function (e) {
        e.preventDefault();
        var elem = $(".hero-block.about-film");

        initVideoPlayer(elem);

        return false;
      });

      $(".tech-vid a").click(function (e) {
        e.preventDefault();
        var elem = $(this);

        initVideoPlayer(elem);

        return false;
      });

      $(".tech-vid a").keyup(function (e) {
        if (e.keyCode == 13) {
          e.preventDefault();
          var vidID = $(this).attr("data-src");

          initVimeoPlayer(vidID);

          return false;
        }
      });

      $(".modal .close").click(function (e) {
        e.preventDefault();
        hideHeroVideo();
        return false;
      });

      $(".vimeo-modal .vimeo-close").click(function (e) {
        e.preventDefault();
        hideGeneralHeroVideo();
        return false;
      });

      $(document).keyup(function (e) {
        if (e.keyCode === 27) {
          // escape key maps to keycode: 27
          e.preventDefault();
          hideHeroVideo();
          hideGeneralHeroVideo();
        }
      });
    }

    $(".chosen-container").append(
      '<i class="fa fa-chevron-down" aria-hidden="true"></i>'
    );

    $(".internship .copy a").click(function () {
      $(".careers .switch.Internships").trigger("click");
    });

    $("body").addClass("animated");

    windowScrolled();
    resizeUI();

    var loopID = $(".hero-block").attr("loop-src");
    if (loopID) {
      setTimeout(function () {
        initHeroVideoAutoPlay("hero-video", loopID);
      }, 200);
    }

    loopID = $(".video-block").attr("loop-src");
    if (loopID) {
      setTimeout(function () {
        initHeroVideoAutoPlay("counting-video", loopID);
      }, 200);
    }

    if ($(".accordion").length > 0) {
      initAccordion();
    }

    // Remove opening in new window for touch devices
    if (isTouch) {
      $("a").removeAttr("target");
    }

    $("a#intern-link").click(function (e) {
      e.preventDefault();
      jumpToInternships();
      return false;
    });

    $("a#join-us-link").click(function (e) {
      e.preventDefault();
      jumpToJobs();
      return false;
    });

    initPeopleTeamGrid();
    initEmbeddedVideo();
    initJobFilters();
    initCareerNav();
    initSearch();

    initDropdowns();

    isFirstCheck = false;
  }

  function initVideoPlayer(elem) {
    var vidID = elem.attr("data-src");
    var mp4VideoURL = elem.attr("data-mp4-src");

    if (mp4VideoURL) {
      initMP4Player(mp4VideoURL);
    } else {
      initVimeoPlayer(vidID);
    }
  }

  function initMP4Player(mp4VideoURL) {
    initVideoModalElement();

    var modal_video_element = getVideoModalInnerElement();

    videoElem = document.createElement("video");
    videoElem.controls = "controls";

    var sourceMP4 = document.createElement("source");
    sourceMP4.type = "video/mp4";
    sourceMP4.src = mp4VideoURL;
    videoElem.appendChild(sourceMP4);

    modal_video_element.appendChild(videoElem);
    videoElem.play();

    is_mp4_video_playing = true;
  }

  function initVideoModalElement() {
    $(".vimeo-modal.vimeo-video").addClass("active");
    setTimeout(function () {
      $("#vimeo-player iframe").css("max-height", "100vh");
      $("#vimeo-player iframe").css("width", "100%");
    }, 500);

    $(".vimeo-modal.vimeo-video").hide().fadeIn();
    $("html, body").css("overflow", "hidden");
  }

  function getVideoModalInnerElement() {
    var videoModalInnerElem = document.querySelector(
      ".vimeo-modal #vimeo-video-wrapper #vimeo-player"
    );

    //Clean up removing any existing child
    videoModalInnerElem.innerHTML = "";

    return videoModalInnerElem;
  }

  function initVimeoPlayer(vidID) {
    initVideoModalElement();

    var options = {
      url: vidID,
      width: window.innerWidth,
    };
    var modal_video_element = getVideoModalInnerElement();
    vimeo_player = new Vimeo.Player(modal_video_element, options);
    vimeo_player.play();
  }

  $(document).keyup(function (e) {
    if (e.keyCode === 27 && $(".vimeo-modal.vimeo-video").hasClass("active")) {
      // escape key maps to keycode: 27
      hideHeroVideo();
      hideGeneralHeroVideo();
    }
  });
  var origFocus;

  function vimeoFocus() {
    //keeps the focus order in place after closing the dialog
    if ($(".vimeo-modal.vimeo-video").hasClass("active")) {
      origFocus.focus();
      $(".vimeo-close").attr("tabindex", "-1");
      $(".vimeo-modal").attr("tabindex", "-1");
    } else {
      origFocus = document.activeElement;
      $(".vimeo-modal").attr("tabindex", "0").focus();
      $(".vimeo-close").attr("tabindex", "0");
    }
  }

  function initEmbeddedVideo() {
    // Video iframe params
    if ($(".iframe-params").length > 0) {
      var params = $(".iframe-params").attr("data-params");
      var src;
      $(".embed-container iframe").each(function () {
        src = $(this).attr("src");
        src = src.replace("feature=oembed", params);
        $(this).attr("src", src);
        $(this).attr("id", "blog-video");
        var loopID = $(".iframe-params").attr("loop-src");
        if (loopID) {
          setTimeout(function () {
            initBlogPostAutoPlay("blog-video", loopID);
          }, 200);
        }
      });
    }
  }

  function initPeopleTeamGrid() {
    if ($(".team-grid").length > 0) {
      var html = $(".team-grid ul").first().html();
      $(".team-grid ul.dup1").html(html);
      $(".team-grid ul.dup2").html(html);
      $(".team-grid ul.dup3").html(html);
    }

    $(".team-grid .default .social-connect a").click(function (e) {
      e.preventDefault();
      var href = $(this).attr("href");
      var win = window.open(href, "_blank");
      win.focus();
      return false;
    });

    $(".team-grid .closebtn").click(function () {
      //closing content when pressing close button
      var expandingBlockOpen = $(".expanding-block.open");
      var sub = expandingBlockOpen.find(".sub");
      expandingBlockOpen.find("img.people-image-bw").removeClass("hidden");
      expandingBlockOpen.find("img.people-image").addClass("hidden");
      expandingBlockOpen
        .find("button.read-more")
        .addClass("read-more-open")
        .removeClass("read-more-close")
        .attr("tabindex", 0)
        .attr("aria-hidden", false);
      expandingBlockOpen
        .find("button.closebtn")
        .attr("tabindex", -1)
        .attr("aria-hidden", true);
      expandingBlockOpen.find("button.read-more").attr("aria-expanded", true);
      sub.attr("aria-hidden", true);
      sub.find("a").attr("tabindex", -1);
      //sub.css('visibility', 'hidden');

      $(".team-grid").removeClass("active");
      $(".expanding-block").removeClass("open");

      $(".expanding-block .sub")
        .stop()
        .animate(
          {
            height: 0,
            easing: "easeInOutQuint",
          },
          500,
          function () {
            $(this).css("visibility", "hidden");
          }
        );

      $(".expanding-block")
        .stop()
        .animate(
          {
            //paddingBottom: 0,
            easing: "easeInOutQuint",
          },
          500,
          function () {}
        );
    });

    // Toggle the team grid
    $(".team-grid .default").click(function (e) {
      var shouldOpen = true;
      if ($(this).closest(".expanding-block").hasClass("open")) {
        shouldOpen = false;
        $(".team-grid").removeClass("active");
      } else {
        $(".team-grid").addClass("active");
      }

      // Reset the old item
      var expandingBlockOpen = $(".expanding-block.open");
      expandingBlockOpen.find("img.people-image-bw").removeClass("hidden");
      expandingBlockOpen.find("img.people-image").addClass("hidden");
      expandingBlockOpen
        .find("button.read-more")
        .addClass("read-more-open")
        .removeClass("read-more-close")
        .attr("tabindex", 0)
        .attr("aria-hidden", false);
      expandingBlockOpen
        .find("button.closebtn")
        .attr("tabindex", -1)
        .attr("aria-hidden", true);
      expandingBlockOpen.find(".sub").attr("aria-hidden", true);
      expandingBlockOpen.find(".sub").find("a").attr("tabindex", -1);
      expandingBlockOpen.find("button.read-more").attr("aria-expanded", false);
      //expandingBlockOpen.find('.sub').css('visibility', 'hidden');

      $(".expanding-block").removeClass("open");

      $(".expanding-block .sub")
        .stop()
        .animate(
          {
            height: 0,
            easing: "easeInOutQuint",
          },
          500,
          function () {
            $(this).css("visibility", "hidden");
          }
        );

      $(".expanding-block")
        .stop()
        .animate(
          {
            //paddingBottom: 0,
            easing: "easeInOutQuint",
          },
          500,
          function () {}
        );

      if (shouldOpen) {
        var dataID = $(this).closest(".expanding-block").attr("data-id");
        var blocks = $("li[data-id='" + dataID + "']");

        blocks.each(function () {
          var block = $(this);
          var sub = block.find(".sub");
          //opening hidden content
          block.addClass("open");
          $(this).find("img.people-image").removeClass("hidden");
          $(this).find("img.people-image-bw").addClass("hidden");
          $(this)
            .find("button.read-more")
            .addClass("read-more-close")
            .removeClass("read-more-open")
            .attr("tabindex", -1)
            .attr("aria-hidden", true);
          $(this).find("button.read-more").attr("aria-expanded", true);
          $(this)
            .find("button.closebtn")
            .attr("tabindex", 0)
            .attr("aria-hidden", false);
          sub.attr("aria-hidden", false);
          sub.find("a").attr("tabindex", 0);
          sub.css("visibility", "visible");

          sub.stop().animate(
            {
              height: getHeightByChildren(sub),
              easing: "easeInOutQuint",
            },
            500,
            function () {}
          );

          block.stop().animate(
            {
              //paddingBottom: 0,
              easing: "easeInOutQuint",
            },
            500,
            function () {}
          );
        });
      }
    });
  }

  // Resize Listener
  function resizeUI() {
    isTouch = $("html").hasClass("touch");
    var winW = $(window).width();
    var winH = $(window).height();
    var winMinW = 320;
    var adminBarH = $("#wpadminbar").height();
    var newh = 0;
    headerH = $("#header").outerHeight(true);

    is320 = winW >= 320;
    is568 = winW >= 568;
    is768 = winW >= 768;
    is968 = winW >= 968;
    is1024 = winW >= 1024;
    is1200 = winW >= 1200;
    is1600 = winW >= 1600;

    winW = winW < winMinW ? winMinW : winW;

    if (!isFirstCheck) {
      windowScrolled();
    }

    var w = $("#canvasLogo").width();
    var h = w * 0.5;
    $("#canvasLogo").height(h);

    $(".video-block iframe").each(function () {
      h = $(this).width() * (9 / 16);
      $(this).height(h);
    });

    if (!is768) {
      h = $("body").height() - $("#footer").height() - $("#header").height();
      $("#header #menu").height(h);
    } else {
      $("#header #menu").height("auto");
    }

    $(".expanding-block").each(function () {
      var block = $(this);
      var sub = block.find(".sub");
      if (block.hasClass("open")) {
        var h = getHeightByChildren(sub);
        sub.height(h);
      } else {
        sub.height(0);
      }
    });

    // Show expanding block sub image if is1024
    if (is1024) {
      $(".expanding-block.open .subimg").stop().show();
    } else {
      $(".expanding-block .subimg").stop().hide();
    }

    var ratio = heroRatio;

    if (is768) {
      h = winW * ratio;
    } else if (isHome && !isTouch) {
      h = winW * ratio;
    } else {
      h = winW;
      h = h > maxMobileHeight ? maxMobileHeight : h;
    }

    // Set hero video height
    if (!is768) {
      $("#hero-video").height(h);
      $("#hero-video").width(h * 1.7777);
      $(".hero-block.home .iframe-wrap").css("padding", h + "px 0 0 0");
      $(".hero-block.home").height(h);
      $(".hero-block.home .iframe-wrap").css("position", "absolute");
      $(".hero-block.home .iframe-wrap").css(
        "left",
        -(h * 1.7777 - winW) / 2 + "px"
      );
    } else {
      $("#hero-video").height(h);
      $("#hero-video").width(winW);
      $(".hero-block.home .iframe-wrap").css("padding", "56.25% 0 0 0");
      $(".hero-block.home").height(h);
      $(".hero-block.home .iframe-wrap").css("position", "absolute");
      $(".hero-block.home .iframe-wrap").css("left", "0px");
    }

    // Constrain the height of the hero wrapper
    if (h > winH - headerH - 52 - adminBarH) {
      h = winH - headerH - 52 - adminBarH;
    }

    h = Math.floor(h);

    var vh = winW * ratio;
    if (!isTouch) {
      if (vh > h) {
        var t = Math.floor((vh - h) * 0.5);
        $(".hero-block iframe").css("top", -t + "px");
      } else {
        $(".hero-block iframe").css("top", "0px");
      }
    }

    h = $(".hero-block.about-film img").height();
    $(".hero-block.about-film").height(h);

    // Press Grid
    h = 0;
    $(".press-grid li").height("auto");
    $(".press-grid li").each(function () {
      h = Math.max(h, $(this).height());
    });

    $(".press-grid li").height(h);

    // Hero title position
    if ($(".news-detail .page-details").length > 0) {
      var off = Number(
        $(".news-detail .page-details").css("margin-top").replace("px", "")
      );
      var t = "-1%";
      if (Math.abs(off) > 0) {
        t = off / 2 + "px";
      }
      $(".centered-copy h1").css("top", t);
    } else {
      $(".centered-copy h1");
    }

    // Careers form
    w = winW;

    w = is568 ? winW - 200 : w;
    w = is768 ? winW - 300 : w;
    $("#grnhse_app").width(w);
  }

  function setScrollVars() {
    winScrollTop = $(window).scrollTop();
    winHeight = $(window).height();
    winScrollTopWithHeight = winScrollTop + winHeight;
  }

  function checkFade(isFirstCheck) {
    if (isFirstCheck) {
      // Main
      $(".content-inner.fader").addClass("faded-delay");
      var a;
      var b;

      $(".fader").each(function () {
        a = $(this).offset().top;
        b = winScrollTopWithHeight;
        if (a < b && !$("this").hasClass("faded-delay")) {
          $(this).addClass("faded-delay");

          // Check for the worldwid block
          if ($(this).hasClass("worldwide")) {
            initWorldwide();
          }
        }
      });
      // Titles
      $(".fader-title").each(function () {
        a = $(this).offset().top;
        b = winScrollTopWithHeight;
        if (a < b && !$("this").hasClass("faded-title-delay")) {
          $(this).addClass("faded-title-delay");
        }
      });

      // Text
      $(".fader-text").each(function () {
        a = $(this).offset().top;
        b = winScrollTopWithHeight;
        if (a < b && !$("this").hasClass("faded-text-delay")) {
          $(this).addClass("faded-text-delay");
        }
      });

      // Delay
      $(".fader-delay").each(function () {
        a = $(this).offset().top;
        b = winScrollTopWithHeight;
        if (a < b && !$("this").hasClass("faded-delay")) {
          $(this).addClass("faded-delay");
        }
      });

      // Content
      $(".fader-content").each(function () {
        a = $(this).offset().top;
        b = winScrollTopWithHeight;
        if (a < b && !$("this").hasClass("faded-delay")) {
          $(this).addClass("faded-delay");
        }
      });
    } else {
      // Main
      $(".fader").each(function () {
        a = $(this).offset().top;
        b = winScrollTopWithHeight;
        if (a < b && !$("this").hasClass("faded")) {
          $(this).addClass("faded");
          // Check for the worldwid block
          if ($(this).hasClass("worldwide")) {
            initWorldwide();
          }
        }
      });
      // Titles
      $(".fader-title").each(function () {
        a = $(this).offset().top;
        b = winScrollTopWithHeight;
        if (a < b && !$("this").hasClass("faded-title")) {
          $(this).addClass("faded-title");
        }
      });

      // Text
      $(".fader-text").each(function () {
        a = $(this).offset().top;
        b = winScrollTopWithHeight;
        if (a < b && !$("this").hasClass("faded-text")) {
          $(this).addClass("faded-text");
        }
      });

      // Text
      $(".fader-delay").each(function () {
        a = $(this).offset().top;
        b = winScrollTopWithHeight;
        if (a < b && !$("this").hasClass("faded-delay")) {
          $(this).addClass("faded-delay");
        }
      });

      // Content
      $(".fader-content").each(function () {
        a = $(this).offset().top;
        b = winScrollTopWithHeight;
        if (a < b && !$("this").hasClass("faded")) {
          $(this).addClass("faded");
        }
      });
    }
  }

  function checkMenu() {
    if ($(window).scrollTop() > 100) {
      if (
        $("body").hasClass("nav-active") ||
        $("body").hasClass("language-nav-active")
      ) {
        hideMenu();
      }
    }

    if (is768) {
      if (
        $("body").hasClass("nav-active") ||
        $("body").hasClass("language-nav-active")
      ) {
        hideMenu();
      }
    }
  }

  function showMenu() {
    $("body").addClass("nav-active");
    $("html, body").css("overflow", "hidden");
    hideLanguageMenu();
  }

  function hideMenu() {
    $(".nav-active").removeClass("nav-active");
    $("html, body").css("overflow", "scroll");
  }

  function showLanguageMenu() {
    $("body").addClass("language-nav-active");
    hideMenu();
  }

  function hideLanguageMenu() {
    $(".language-nav-active").removeClass("language-nav-active");
  }

  function onYouTubeIframeAPIReady() {}

  function showHeroVideo(vidID) {
    $(".modal.video").addClass("active");
    $(".modal.video").hide().fadeIn();
    $("html, body").css("overflow", "hidden");

    if (!player) {
      initPlayer(vidID);
    } else {
      player.playVideo();
    }
  }

  function initHeroVideoAutoPlay(id, src) {
    var heroPlayer = new YT.Player(id, {
      videoId: src,
      events: {
        onReady: function (event) {
          event.target.mute();
          event.target.playVideo();
        },
      },
    });
  }

  function initBlogPostAutoPlay(id, src) {
    var postPlayer = new YT.Player(id, {
      videoId: src,
      events: {
        onReady: function (event) {
          event.target.mute();
          event.target.playVideo();
        },
      },
    });
  }

  function initPlayer(vidID) {
    var src = vidID;

    player = new YT.Player("player", {
      videoId: src,
      playerVars: {
        showinfo: 0,
        controls: 1,
        rel: 0,
        modestbranding: 1,
        iv_load_policy: 3,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });

    function onPlayerReady(event) {
      event.target.playVideo();
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    var done = false;

    function onPlayerStateChange(event) {
      if (event.data == YT.PlayerState.ENDED && !done) {
        setTimeout(stopVideo, 100);
        done = true;
      }
    }

    function stopVideo() {
      if (!player) return;
      player.stopVideo();
      hideHeroVideo();
    }
  }

  function hideHeroVideo() {
    // var video = document.getElementById('hero-video-full');
    // video.pause();
    if (!player) return;
    player.pauseVideo();

    $(".modal.video").fadeOut(function () {
      $(".modal.video").removeClass("active");
      $("html, body").css("overflow", "scroll");
      //video.src = '';
      player.stopVideo();
      $("#video-wrapper iframe").remove();
      $("#video-wrapper").append('<div id="player"></div>');
      player = null;
    });
  }

  function hideGeneralHeroVideo() {
    if (vimeo_player) {
      // Vimeo reproducing
      vimeo_player.destroy();
    } else if (is_mp4_video_playing) {
      // MP4 video is playing. Update the flag and stop the video.
      is_mp4_video_playing = false;

      videoElem.pause();
      videoElem.currentTime = 0;
    } else {
      // No Video playing. Just return
      return;
    }

    // Close Modal
    $(".vimeo-modal.vimeo-video").fadeOut(function () {
      $(".vimeo-modal.vimeo-video").removeClass("active");
      $("html, body").css("overflow", "initial");
    });
  }

  function initAnimatedNumbers() {
    // Job count
    try {
      $(".numbers-grid.careers li:first-child h2").text(JOB_COUNT);
    } catch (e) {}

    $(
      ".numbers-grid li .main-number, .hero-block h1 span, .video-block.alt h1 span"
    ).each(function (i) {
      var num = Number($(this).text().replaceAll(",", ""));
      if (!num) {
        num = Number($(this).text().replaceAll(" ", ""));
      }

      $(this).attr("data-number", num);
      $(this).text("0");
    });
  }

  function initAccordion() {
    var allPanels = $(".accordion > dd").hide();

    $triggers = $(".accordion > dt > a, .accordion > dt > button");

    $triggers.click(function (evt) {
      var isActive = $(this).hasClass("active");
      if (!isActive) {
        // close all panels
        $triggers.removeClass("active").attr("aria-expanded", "false");
        $(".accordion .wysiwyg").removeClass("active");
        allPanels.slideUp();

        // open selected
        $(this).parent().next().slideDown();
        $(this).addClass("active");
        $(this).attr("aria-expanded", "true");
        var rel = $(this).attr("rel");
        $(".accordion .wysiwyg." + rel).addClass("active");
      } else {
        // close all
        $triggers.removeClass("active").attr("aria-expanded", "false");
        $(".accordion .wysiwyg").removeClass("active");
        allPanels.slideUp();
      }
      return false;
    });
  }

  function initSearch() {
    if ($("#s").length > 0) {
      $("#s").click(function () {
        $(this).closest(".control").addClass("search-active");
      });

      $("#s").keyup(function (e) {
        //if not tabbing, open search
        if (e.keyCode !== 9 && e.keyCode !== 16) {
          $(this).closest(".control").addClass("search-active");
        }
      });

      $("#s").blur(function (e) {
        $(this).closest(".control").removeClass("search-active");
      });

      /*
            // $(document).on('click', function (event) {
            //     if (!$(event.target).closest('.form-holder').length) {
            //         $('.control.search-active').removeClass('search-active');
            //     }
            // });
            */
    }
  }

  function initDropdowns() {
    var $dropdowns = $(".dropdown");

    // we need to attach any callback function used to
    // the window so we can find it later
    window.filterCountry = filterCountry;
    window.resetCountryFilter = resetCountryFilter;
    window.searchCareers = searchCareers;

    if ($dropdowns.length) {
      $dropdowns.each(function (idx, el) {
        var $dd = $(this);
        var $button = $("button", $dd);
        var $focusable = $(".focusable", $dd);
        var $links = $(".dropdown__menu-link", $dd);

        $dd
          .on("mouseenter focusin", function (evt) {
            if (!$dd.is("disabled")) {
              $dd.addClass("active");
              $button.attr("aria-expanded", "true");
            }
          })
          .on("mouseleave focusout", function (evt) {
            $dd.removeClass("active");
            $button.attr("aria-expanded", "false");
          })
          .on("keydown", function (evt) {
            // Prevent arrow keys from scrolling window
            if ([32, 37, 38, 39, 40].indexOf(evt.keyCode) > -1) {
              evt.preventDefault();
            }
          })
          .on("keyup", function (evt) {
            if (!$dd.is("disabled")) {
              var currentIndex = $focusable.index(document.activeElement);
              var indexToFocus;

              if (
                "ArrowRight" == evt.key ||
                39 == evt.keyCode ||
                "ArrowDown" == evt.key ||
                40 == evt.keyCode
              ) {
                indexToFocus = currentIndex + 1;
                indexToFocus =
                  $focusable.length == indexToFocus ? 0 : indexToFocus;
                $focusable.eq(indexToFocus).focus();
              } else if (
                "ArrowUp" == evt.key ||
                38 == evt.keyCode ||
                "ArrowLeft" === evt.key ||
                37 == evt.keyCode
              ) {
                indexToFocus = currentIndex - 1;
                indexToFocus =
                  indexToFocus < 0 ? $focusable.length - 1 : indexToFocus;
                $focusable.eq(indexToFocus).focus();
              } else if ("Escape" == evt.key || 27 == evt.keyCode) {
                document.activeElement.blur();
              }

              evt.preventDefault();
              evt.stopPropagation();
              return false;
            }
          });

        $links.on("click", function (evt) {
          var $t = $(this);
          var preventNav = true;

          $button.text($t.text());

          if (true === $t.data("jsReset")) {
            $button.text($button.data("jsDefaultLabel"));

            if (undefined !== $dd.data("jsReset")) {
              window[$dd.data("jsReset")]($t.text());
            }
          } else if (undefined !== $dd.data("jsCallback")) {
            window[$dd.data("jsCallback")].apply(this, [
              $t.data("jsValue") || $t.text(),
            ]);
          } else {
            preventNav = false;
          }

          if (preventNav) {
            document.activeElement.blur();

            evt.preventDefault();
            evt.stopPropagation();

            return false;
          }
        });

        $dd.addClass("initialized");
      });
    }
  }

  function checkNumbers() {
    // Numbers grid
    var a;
    var b;
    var c;

    // Number with decimals
    $(".numbers-grid li .main-number, .hero-block h1 span").each(function (i) {
      a = $(this).offset().top + 10;
      b = winScrollTopWithHeight;
      c = $(this).outerHeight();

      if (a < b && a + c > winScrollTop && !$(this).hasClass("animated")) {
        $(this).addClass("animated");
        var num = Number($(this).attr("data-number"));
        var decimal_places = 1;
        var decimal_factor = decimal_places === 0 ? 1 : decimal_places * 10;
        $(this).stop();
        $(this).text("0");

        if (isInteger(num)) {
          $(this).animateNumber(
            {
              number: num,
              numberStep: function (now, tween) {
                target = $(tween.elem);
                var floored_number = Math.floor(now);
                if (isSpanish) {
                  var strNum = String(floored_number);
                  var txt = strNum;

                  if (strNum.length > 3) {
                    var pos = strNum.length - 3;
                    txt = strNum.slice(0, pos) + " " + strNum.slice(pos);
                  }

                  target.text(txt);
                } else {
                  target.text(floored_number);
                }
              },
            },
            numAniDur
          );
        } else {
          $(this).animateNumber(
            {
              number: num * decimal_factor,
              numberStep: function (now, tween) {
                var floored_number = Math.floor(now) / decimal_factor,
                  target = $(tween.elem);
                if (decimal_places > 0) {
                  floored_number = floored_number.toFixed(decimal_places);
                }

                if (isSpanish) {
                  var txt;
                  var strNum = String(floored_number);
                  if (strNum.indexOf(".") > -1) {
                    txt = String(floored_number).replace(".", ",");
                  } else {
                    if (strNum.length > 3) {
                      var pos = strNum.length - 4;
                      txt = strNum.slice(0, pos) + " " + strNum.slice(pos);
                    }
                  }

                  target.text(txt);
                } else {
                  target.text(floored_number);
                }
              },
            },
            numAniDur
          );
        }
      } else if (a + c < winScrollTop && $(this).hasClass("animated")) {
        //$(this).removeClass('animated');
      } else if (a > b && $(this).hasClass("animated")) {
        //$(this).removeClass('animated');
      }
    });

    // Number with commas
    $(".video-block.alt h1 span").each(function (i) {
      a = $(this).offset().top;
      b = winScrollTopWithHeight;
      c = $(this).outerHeight();
      if (a < b && a + c > winScrollTop && !$(this).hasClass("animated")) {
        $(this).stop();
        $(this).text("0");
        $(this).addClass("animated");
        var num = Number($(this).attr("data-number"));
        var decimal_places = 1;
        var decimal_factor = decimal_places === 0 ? 1 : decimal_places;

        var comma_separator_number_step;
        if (isSpanish) {
          comma_separator_number_step = $.animateNumber.numberStepFactories.separator(
            " "
          );
        } else {
          comma_separator_number_step = $.animateNumber.numberStepFactories.separator(
            ","
          );
        }

        $(this).animateNumber(
          {
            number: num * decimal_factor,
            numberStep: comma_separator_number_step,
          },
          numAniDur
        );
      } else if (a + c < winScrollTop && $(this).hasClass("animated")) {
        $(this).removeClass("animated");
        $(this).text("0");
      } else if (a > b && $(this).hasClass("animated")) {
        $(this).removeClass("animated");
        $(this).text("0");
      }
    });

    // worldwide numbers
    $(".worldwide ul div .number span").each(function (i) {
      a = $(this).offset().top;
      b = winScrollTopWithHeight;
      c = $(this).outerHeight();

      if (a < b && a + c > winScrollTop && !$(this).hasClass("animated")) {
        $(this).addClass("animated");
        var num = Number($(this).attr("data-number"));
        var decimal_places = 1;
        var decimal_factor = decimal_places === 0 ? 1 : decimal_places * 10;
        $(this).stop();
        $(this).text("0");
        var delay = isTouch ? 0 : 500;
        if (isInteger(num)) {
          $(this).delay(delay).animateNumber(
            {
              number: num,
            },
            numAniDur
          );
        } else {
          $(this)
            .delay(delay)
            .animateNumber(
              {
                number: num * decimal_factor,
                numberStep: function (now, tween) {
                  var floored_number = Math.floor(now) / decimal_factor,
                    target = $(tween.elem);
                  if (decimal_places > 0) {
                    floored_number = floored_number.toFixed(decimal_places);
                  }
                  target.text(floored_number);
                },
              },
              numAniDur
            );
        }
      }
    });
  }

  function filterCountry(country) {
    country = country.toLowerCase().replace(/\s/g, "");

    if (
      "all" == country ||
      "showall" == country ||
      "showallcountries" == country
    ) {
      resetCountryFilter();
    } else {
      var $blocks = $(".education-block")
        .removeClass("fader")
        .removeClass("faded");

      $(".education-blocks").fadeTo(400, 0, function () {
        $blocks.hide();
        $(".education-blocks").fadeTo(0, 100);
        $blocks.filter('[data-country*="' + country + '"]').fadeIn();
      });
    }
  }

  // ----------------------------------------------------------------------------
  //
  //  CAREERS Job Selector
  //

  var $jobs_list = $("ul.listings");
  var $jobs_heading = $(".department .role-title");

  var $no_resluts = $(".no-results");

  var $ddRole = $("#job-role .dropdown");
  var $ddGroup = $("#job-group .dropdown");
  var $ddLocation = $("#job-location .dropdown");
  var $careerMenus = $([]).add($ddRole).add($ddGroup).add($ddLocation);

  function initJobFilters() {
    if ($("body").hasClass("page-template-page-careers") || $("body").hasClass("page-template-page-careers-v2")) {
      // Hide all the jobs to start
      $jobs_list.children().hide();
      $no_resluts.hide();

      $(".dropdown__menu-link", $careerMenus).on("click", function (evt) {
        // set displayed value to currently selected value
        // when an option link is clicked
        var $t = $(this);
        var $menu = $t.parents(".dropdown");
        var jsValue = $t.data("jsValue");
        $menu.data("jsCurrentValue", jsValue);
      });
    }
  }

  function initCareerNav() {
    // conditionally add application privacy link to footer on carreers page
    if (!isCareer) {
      $jpl = $('a[href*="job-applicant-privacy-notice"]', "footer");
      $jpl.parents("li").remove();
    }
  }

  /**
   *
   * @param {bool} topLevel set to true if the topLevel (Department) <select> is changing
   */
  function searchCareers() {
    var $t = $(this, $careerMenus);
    var data;
    var query = "li";

    var rVal = $ddRole.data("jsCurrentValue");
    var gVal = $ddGroup.data("jsCurrentValue");
    var lVal = $ddLocation.data("jsCurrentValue");

    if ($t.length) {
      data = $t.data();
    } else {
      data = $ddRole.data();
    }

    if (data["topLevel"]) {
      gVal = lVal = "all";
      resetCareerSubFilters();
    }

    if (!!rVal) {
      if (rVal === "all") {
        query += "[data-department]";
      } else {
        query += '[data-department="' + rVal + '"]';
      }

      if (!!gVal) {
        if (gVal === "all") {
          query += "[data-group]";
        } else {
          query += '[data-group="' + gVal + '"]';
        }
      }

      if (!!lVal) {
        if (lVal === "all") {
          query += "[data-location]";
        } else {
          query += '[data-location="' + lVal + '"]';
        }
      }
      query = query === "li" ? "NOTHING" : query;

      // hide all the jobs
      $jobs_list.children().hide();

      // select jobs to show based on query
      var $jobsToShow = $(query, $jobs_list);

      if ($jobsToShow.length) {
        var prefix = "";
        var $dept = $(
          '[data-js-value="' + $ddRole.data("jsCurrentValue") + '"]',
          $ddRole
        );
        var deptData = $dept.data();

        if (
          "internships" !== deptData["departmentTitle"].toLowerCase() &&
          "all departments" !== deptData["departmentTitle"].toLowerCase()
        ) {
          prefix = "Careers in ";
        }

        $jobs_heading.text(prefix + deptData["departmentTitle"]);
        $no_resluts.hide();
        $jobs_list.show();
        $jobsToShow.show();
      } else {
        $jobs_heading.text("");
        $jobs_list.hide();
        $no_resluts.show();
      }
    } else {
      $no_resluts.hide();
      $jobs_list.hide();
    }

    data["topLevel"] && updateControls(data["topLevel"]);
  }

  function resetCareerSubFilters() {
    var $gButton = $("button", $ddGroup);
    var $lButton = $("button", $ddLocation);

    $gButton.text($gButton.data("jsDefaultLabel"));
    $lButton.text($lButton.data("jsDefaultLabel"));

    $(".dropdown__menu-item", $ddGroup)
      .addClass("disabled")
      .attr("aria-disabled", true)
      .hide();
    $(".dropdown__menu-item", $ddLocation)
      .addClass("disabled")
      .attr("aria-disabled", true)
      .hide();

    $ddGroup.addClass("disabled").attr("aria-disabled", true);
    $ddLocation.addClass("disabled").attr("aria-disabled", true);

    $ddGroup.data("jsCurrentValue", "all");
    $ddLocation.data("jsCurrentValue", "all");
  }

  function updateControls(update) {
    $ddGroup.removeClass("disabled");
    $(".dropdown__menu-item", $ddGroup)
      .addClass("disabled")
      .attr("aria-disabled", true)
      .hide();

    $ddLocation.removeClass("disabled");
    $(".dropdown__menu-item", $ddLocation)
      .addClass("disabled")
      .attr("aria-disabled", true)
      .hide();

    var groupObj = {};
    var groupArray;

    var locationObj = {};
    var locationArray;

    // iterate over visible jobs and store group and location info
    $("li:visible", $jobs_list).each(function (idx) {
      d = $(this).data();
      !!d.group && (groupObj[d.group] = true);
      !!d.location && (locationObj[d.location] = true);
    });

    /* groups ----------------- */
    for (var g in groupObj) {
      // selectively turn options back on for matching groups
      $('[data-js-value="' + g + '"]', $ddGroup)
        .parent()
        .removeClass("disabled")
        .removeAttr("aria-disabled")
        .show();
    }
    groupArray = Object.keys(groupObj);

    if (groupArray.length) {
      $ddGroup.removeClass("disabled").removeAttr("aria-disabled");

      if (1 === groupObj.length) {
        $(".dropdown__menu-item:not(.disabled)", $ddGroup).find("a")[0].click();
        $ddGroup.addClass("disabled").attr("aria-disabled", true);
      } else {
        $('[data-js-value="all"]', $ddGroup)
          .parent()
          .removeClass("disabled")
          .removeAttr("aria-disabled")
          .show();
      }
    } else {
      $ddGroup.addClass("disabled").attr("aria-disabled", true);
    }

    /* locations ----------------- */
    for (var l in locationObj) {
      // selectively turn options back on for matching locations
      $('[data-js-value="' + l + '"]', $ddLocation)
        .parent()
        .removeClass("disabled")
        .removeAttr("aria-disabled")
        .show();
    }
    locationArray = Object.keys(locationObj);

    if (locationArray.length) {
      $ddLocation.removeClass("disabled").removeAttr("aria-disabled");

      if (1 === locationArray.length) {
        $(".dropdown__menu-item:not(.disabled)", $ddLocation)
          .find("a")[0]
          .click();
        $ddLocation.addClass("disabled").attr("aria-disabled", true);
      } else {
        $('[data-js-value="all"]', $ddLocation)
          .parent()
          .removeClass("disabled")
          .removeAttr("aria-disabled")
          .show();
      }
    } else {
      // disable dropdown with no options
      $ddLocation.addClass("disabled").attr("aria-disabled", true);
    }
  }

  function jumpToJobs() {
    animateToJobs();
  }

  function jumpToInternships() {
    $jrs.val("internships").trigger("change");
    animateToJobs();
  }

  function animateToJobs() {
    var target = $("#jobs");

    $("html,body").animate(
      {
        scrollTop: target.offset().top + 1,
      },
      1000,
      function () {
        windowScrolled();
        isAnimating = false;
      }
    );
  }

  // END JOB SELECTORS ----------------------------------------------------------------------------

  function resetCountryFilter() {
    var $blocks = $(".education-block")
      .removeClass("fader")
      .removeClass("faded");

    $(".education-blocks").fadeTo(400, 0, function () {
      $blocks.show();
      $(".education-blocks").fadeTo(400, 1);
    });
  }

  function fadeTitles() {
    $("body").addClass("fade");
    $("body").show().css("opacity", "1");
    $(".hero-fader").addClass("hero-faded");
    $(".tit-fader").addClass("tit-faded");
  }

  function windowScrolled() {
    setScrollVars();
    checkMenu();
    if (!isTouch && !isFirstCheck) {
      checkFade();
    }

    checkNumbers();
  }

  function resizeToMax(selector) {
    var h = 0;
    $(selector).height("auto");

    $(selector).each(function () {
      h = $(this).height() > h ? $(this).height() : h;
    });

    $(selector).height(h);
  }

  function resizeToSquare(selector) {
    var h = 0;
    var w = $(selector).first().outerWidth();
    $(selector).height(w);
  }

  function setHeightByChildren(parent) {
    var h = 0;
    parent.children().each(function () {
      if ($(this).is(":visible")) {
        h += $(this).outerHeight(true);
      }
    });

    parent.height(h);
  }

  function getHeightByChildren(parent) {
    var h = 0;
    parent.children().each(function () {
      if ($(this).is(":visible")) {
        h += $(this).outerHeight(true);
      }
    });

    return h;
  }

  function isInteger(num) {
    return (num ^ 0) === num;
  }

  function getURLParameter(param) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split("&");

    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split("=");
      if (sParameterName[0] == param) {
        return sParameterName[1];
      }
    }
  }





  /* ============== For Parents  =============== */
  if ($("body").hasClass("page-template-page-for_parents")) {

    $.each($(".series"), function (index, slideContainer) {
      $("video.video-" + index).on("timeupdate", function (event) {
        $("span.active-indicator-" + index)
          .stop(true, false)
          .animate({
            height: (this.currentTime * 200) / this.duration,
          });
      });
    });
  }


  /* ============== Advisory Board  =============== */
  if ($(".advisory-board").length) {
    var $avbSlider = $(".advisory-board .slider");


    // var $slider = $(".advisory-board .slider");
    var $profiles = $(".profile", $avbSlider);
    var $bios = $(".mbr-bio", $avbSlider);

    if ( $profiles.length ) {
      setTimeout(function() {
        $profiles
          .find(".mbr-bio:not([aria-hidden=false]) [tabindex]")
          .attr("tabindex", "-1");
      }, 10);

      // open bio links in a new window
      $bios.each(function (idx) {
        $("a", this).attr("target", "_blank");
      });

      // initial tabindex for bios
      $(".mbr-bio [tabindex]", $profiles).attr("tabindex", -1);

      function openProfile(profile) {
        var $profile = $(profile);
        var $rm = $(".read-more", $profile);
        var $cb = $(".closebtn", $profile);
        var $bio = $(".mbr-bio", $profile);

        $profile.addClass("active");

        $cb.css("display", "block");
        $cb.attr("aria-hidden", "false");
        $cb.attr("tabindex", "0");

        $rm.css("display", "none");
        $rm.attr("aria-hidden", "true");
        $rm.attr("tabindex", "-1");

        $bio.attr('aria-hidden', 'false').slideDown();
      }

      function closeProfile(profile) {
        var $profile = $(profile);
        var $rm = $(".read-more", $profile);
        var $cb = $(".closebtn", $profile);
        var $bio = $(".mbr-bio", $profile);

        $profile.removeClass("active");

        $rm.css("display", "block");
        $rm.attr("aria-hidden", "false");
        $rm.attr("tabindex", "0");

        $cb.css("display", "none");
        $cb.attr("aria-hidden", "true");
        $cb.attr("tabindex", "-1");

        $bio.attr('aria-hidden', 'true').slideUp();
      }

      $profiles.each(function(){ closeProfile(this); });

      $(".profile-inner", $profiles).on("click", function (event) {

        console.log('event', event);

        var $eventTarget = $(event.target);
        var isBioEvent = $eventTarget.parents(".mbr-bio").length;
        var $profile = $(this).parents('.profile')

        if (!isBioEvent) {
          $profiles.not(this).each(function () {
            closeProfile(this);
          });

          if ($(".mbr-bio", this).is(":visible")) {
            // hide bio
            closeProfile($profile);
          } else {
            // show bio
            openProfile($profile);
          }
        }
      });

      $avbSlider.on("beforeChange", function () {
        $profiles.filter(".active").each(function () {
          closeProfile(this);
        });
      });

      $avbSlider.on("afterChange init", function () {
        $('.slick-slide[aria-hidden=true] .read-more', $avbSlider).attr('tabindex', '-1')
        $('.slick-slide[aria-hidden=false] .read-more', $avbSlider).attr('tabindex', '0')

        $('.slick-arrow.slick-disabled').attr('tabindex', '-1')
        $('.slick-arrow:not(.slick-disabled)').attr('tabindex', '0')
      });

    }

    $avbSlider.slick({
      dots: false,
      infinite: false,
      speed: 700,
      slidesToShow: 2,
      slidesToScroll: 1,
      customPaging: function (slider, i) {
        return (
          '<button type="button" id="slick-slide-control0"' +
          i +
          ' aria-controls="slick-slide0"' +
          i +
          ' role="tab"><div class="slider-dot-item"></button>'
        );
      },
      responsive: [
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }



  /* ============== Our People or APM =============== */
  if (
    $("body").hasClass("page-template-page-people") ||
    $("body").hasClass("page-template-page-apm")
  ) {
    $(document).on("mouseover", "img.people-image-bw", function () {
      if (!$(this).closest("li").hasClass("open")) {
        if ($(this).attr("src") !== "") {
          $(this).addClass("hidden");
          $(this).prev("img").removeClass("hidden");
        }
      }
    });

    $(document).on("mouseout", "img.people-image", function () {
      if (!$(this).closest("li").hasClass("open")) {
        if ($(this).next("img").attr("src") !== "") {
          $(this).next("img").removeClass("hidden");
          $(this).addClass("hidden");
        }
      }
    });
  }

  /* ============== APM Page =============== */
  if ($("body").hasClass("page-template-page-apm")) {
    // aditl slider
    document.addEventListener("DOMContentLoaded", init_aditl_slider);
    init_aditl_slider();

    function init_aditl_slider() {
      // Init Slider
      var aditl_slider_element = $(".aditl-slider__slick");
      aditl_slider_element.slick({
        centerMode: true,
        variableWidth: true,
        focusOnSelect: true,
        arrows: false,
        dots: true,
        /* adaptiveHeight: true, */
        responsive: [
          {
            breakpoint: 2500,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: "40px",
              slidesToShow: 5,
            },
          },
          {
            breakpoint: 1700,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: "40px",
              slidesToShow: 5,
            },
          },
          {
            breakpoint: 768,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: "40px",
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 480,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: "40px",
              slidesToShow: 1,
            },
          },
        ],
      });

      // Update sizes for no selected items
      aditl_slider_element.on("beforeChange", update_slider_items_sizes);
      update_slider_items_sizes(null, null, null, 0); // Fire with the first item on page load.

      // Update time of 'centered' item
      aditl_slider_element.on("afterChange", update_time_with_centered_item);
      update_time_with_centered_item();
    }

    function update_time_with_centered_item() {
      var current_time = $(
        ".aditl-slider__item.slick-slide.slick-current .aditl-slider__inner-wrapper"
      ).data("item-time");
      var time_element = $(".aditl-slider__time");
      var ampm_element = $(".aditl-slider__ampm");

      var time_split_array = current_time.split(":");

      var hour, minute, ampm;
      minute = time_split_array[1];
      hour_24 = time_split_array[0];

      if (12 > hour_24) {
        hour = hour_24 - 0; // To remove the first '0' in te hour
        ampm = "AM";
      } else if (12 == hour_24) {
        hour = hour_24;
        ampm = "PM";
      } else {
        hour = hour_24 - 12;
        ampm = "PM";
      }

      time_element.html(hour + ":" + minute);
      ampm_element.html(ampm);

      var hour_element = document.querySelector(".clock__hour");
      var minute_element = document.querySelector(".clock__minute");

      // Current angles. - 90 because it start with 90 degrees
      var hour_current_angle = parseInt(hour_24) * 30 - 90;
      var minute_current_angle = parseInt(minute) * 6 - 90;

      // Fix for negative values
      if (minute_current_angle < 0) {
        minute_current_angle = minute_current_angle + 360;
      }

      // Grab accumulated angles. Always clockwise direction
      var hour_accumulated_angle =
        window.roblox_accumulated_hour_angle || hour_current_angle;
      var minute_accumulated_angle =
        window.roblox_accumulated_minute_angle || minute_current_angle;

      // Calculate amount of spins
      var hour_amount_of_spins = Math.floor(hour_accumulated_angle / 360);
      var minute_amount_of_spins = Math.floor(minute_accumulated_angle / 360);

      // Fix edge cases
      if (
        window.roblox_last_hour_angle &&
        hour_current_angle < window.roblox_last_hour_angle &&
        hour_amount_of_spins == window.roblox_last_hour_spins
      ) {
        hour_amount_of_spins++;
      }
      if (
        window.roblox_last_hour_angle &&
        hour_current_angle >= window.roblox_last_hour_angle
      ) {
        hour_amount_of_spins = window.roblox_last_hour_spins || 0;
      }

      if (
        window.roblox_last_minute_angle &&
        minute_current_angle < window.roblox_last_minute_angle &&
        minute_amount_of_spins == window.roblox_last_minute_spins
      ) {
        minute_amount_of_spins++;
      }
      if (
        window.roblox_last_minute_angle &&
        minute_current_angle >= window.roblox_last_minute_angle
      ) {
        minute_amount_of_spins = window.roblox_last_minute_spins || 0;
      }

      // Calculate new angle based on the amount of spins. Always clockwise direction
      var H = hour_amount_of_spins * 360 + hour_current_angle;
      var M = minute_amount_of_spins * 360 + minute_current_angle;

      // Set new rotation into elements
      hour_element.style.transform = "rotate(" + H + "deg)";
      minute_element.style.transform = "rotate(" + M + "deg)";

      // Save accumulated values
      window.roblox_accumulated_hour_angle = H;
      window.roblox_accumulated_minute_angle = M;

      // Save last angles to compare next time
      window.roblox_last_hour_angle = hour_current_angle;
      window.roblox_last_hour_spins = hour_amount_of_spins;

      window.roblox_last_minute_angle = minute_current_angle;
      window.roblox_last_minute_spins = minute_amount_of_spins;
    }

    function update_slider_items_sizes(
      event,
      slick,
      currentSlide,
      nextSlideIndex
    ) {
      // Only for medium and larger screens
      if (480 > window.innerWidth) return;

      var all_items = $(".aditl-slider__item");

      var centered_item = $(
        '.aditl-slider__item.slick-slide[data-slick-index="' +
          nextSlideIndex +
          '"]'
      );

      var next_index = nextSlideIndex + 1;
      var prior_index = nextSlideIndex - 1;

      var next_item = $(
        '.aditl-slider__item.slick-slide[data-slick-index="' + next_index + '"]'
      );
      var prior_item = $(
        '.aditl-slider__item.slick-slide[data-slick-index="' +
          prior_index +
          '"]'
      );

      centered_item.css("transform", "scale(1.05)");
      next_item.css("transform", "scale(0.9) translateX(22px)");
      prior_item.css("transform", "scale(0.9) translateX(-22px)");

      all_items
        .not(centered_item)
        .not(next_item)
        .not(prior_item)
        .css("transform", "scale(0.75)");
    }
  }

  /* ============== For Parents ScrollMagic =============== */
  if ($("body").hasClass("page-template-page-digital-well-being")) {
    var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

    // Doesn't show the effect if the browser is IE11
    if (!isIE11) {
      var controller = new ScrollMagic.Controller();

      var sectionElement = $(".safety-advice");
      var bulletListItems = $(".bullet-list__item");

      bulletListItems.each(function (i) {
        var el = this;
        var $el = $(el);
        var $wrapper = $el.find(".bullet-list__wrapper");
        var bulletLine = $el.find(".safety-advice__line");
        new ScrollMagic.Scene({
          triggerElement: el,
          duration: $el.outerHeight(),
          reverse: true,
        })
          // .addIndicators({
          //     name: 'bullet-item-' + i
          // })
          .on("enter", function (event) {
            if (event.scrollDirection === "FORWARD") {
              $wrapper.css("opacity", 1);
              $el.addClass("active");
            }
          })
          .on("leave", function (event) {
            if (event.scrollDirection === "REVERSE") {
              $el.removeClass("active");
            }
          })
          .on("progress", function (event) {
            if (i === bulletListItems.length - 1) return;
            bulletLine.css("height", event.progress * 100 + "%");
          })
          .addTo(controller);
      });

      // var headingScene = new ScrollMagic.Scene({
      //     triggerElement: sectionElement.get(0),
      //     duration: 700,
      //     triggerHook: 0,
      //     reverse: true
      // })
      // .setPin('.safety-advice')
      // .addIndicators({
      //     name: 'slide-item'
      // })
      // .addTo(controller);
    } else {
      // If it's IE11 just add a data attribute for make it always visible
      document
        .getElementsByClassName("bullet-list")[0]
        .setAttribute("without-effect", "true");
    }
  }

  // testimonials slider / careers v2 page
  if ($('.testimonials-slider').length) {
    $('.testimonials-slider .testimonials-slider__slick').slick({
      dots: true,
      prevArrow: $('.testimonials-slider__prev'),
      nextArrow: $('.testimonials-slider__next'),
      infinite: false,
    })
  }

  // swiperjs
  if (document.getElementById("partial-swiper-js")) {
    var carousel = new Swiper('#partial-swiper-js', {
      spaceBetween: 32,
      centeredSlides: true,
      loop: true,
      slidesPerView: 1,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      autoplay: {
        delay: 5000,
      },
      breakpoints: {
        480: {
          slidesPerView: 1.25
        },
        1024: {
          slidesPerView: 1.5
        },
        1280: {
          slidesPerView: 1.75
        }
      }
    });
  }

  if (document.getElementById("full-swiper-js")) {
    var carousel = new Swiper('#full-swiper-js', {
      spaceBetween: 0,
      centeredSlides: true,
      loop: false,
      slidesPerView: 1,
      pagination: false,
      allowTouchMove: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    });

    if (document.getElementById("full-swiper-js-thumbnails")) {
      var thumbnails = new Swiper('#full-swiper-js-thumbnails', {
        spaceBetween: 32,
        centeredSlides: true,
        loop: false,
        slidesPerView: 'auto',
        slideToClickedSlide: true,
        allowTouchMove: true
      });

      carousel.controller.control = thumbnails;
      thumbnails.controller.control = carousel;
    }
  }

  $(".play-modal-video[data-src]").click(function (e) {
    e.preventDefault();
    var elem = $(this);

    initVideoPlayer(elem);

    return false;
  });


  // GRAVITY FORMS CUSTOMIZATIONS
  $('select.gfield_select').on('change', function(ev) {
    if ($(this).val()) {
      $(this).addClass('selected');
    } else {
      $(this).removeClass('selected');
    }
  });

  $('.ginput_container_fileupload input[type="file"]').change(function() {
    // var i = $('.file-upload > label').clone();
    var file = $(this)[0].files[0].name;
    $('.file-upload > label').text(file);
    console.log('file', file);
  });

  /* ============== Accordian  =============== */
  if ($(".accordian").length) {
    $(".accordian").click(function () {
      if ($(this).hasClass("expanded")) {
        $(this).removeClass("expanded");
      } else {
        $(this).addClass("expanded");
      }
    });
  }

  if ($(".accordian").length) {
    $(".accordian .hit").click(function () {
      if ($(this).hasClass("expanded")) {
        $(this).removeClass("expanded");
      } else {
        $(this).parent().find(".hit").removeClass("expanded");
        $(this).addClass("expanded");
      }
    });
  }

  String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, "g"), replacement);
  };

  // Updated hero video
  var video = document.getElementById("hero-video");

  if (!isTouch && video) {
    video.addEventListener(
      "loadeddata",
      function () {
        video.mute();
        initWindow();
      },
      false
    );
    setTimeout(function () {
      if (!isWindowInit) {
        initWindow();
      }
    }, 1000);
  } else {
    initWindow();
  }

  /**
   * Fire change event for career selector to use default values sent through params
   */
  // document.addEventListener('DOMContentLoaded', update_careers_selectors);
  // update_careers_selectors();

  // function update_careers_selectors() {

  //     if ($('#job-role').length) {

  //         var job_role_element = document.querySelector('#job-role select');
  //         var job_role_event = new Event('change');
  //         job_role_element.dispatchEvent(job_role_event);

  //         scroll_to_selectors();
  //     }
  // }

  function scroll_to_selectors() {
    // Only scroll to section if we have
    if ($("#scroll-to-job-role-selector").length) {
      window.scroll({
        behavior: "smooth",
        left: 0,
        top: $("#job-role").offset().top - 75,
      });
    }
  }
});

$.extend($.easing, {
  def: "easeOutQuad",
  easeInQuad: function (e, t, n, r, i) {
    return r * (t /= i) * t + n;
  },
  easeOutQuad: function (e, t, n, r, i) {
    return -r * (t /= i) * (t - 2) + n;
  },
  easeInOutQuad: function (e, t, n, r, i) {
    if ((t /= i / 2) < 1) return (r / 2) * t * t + n;
    return (-r / 2) * (--t * (t - 2) - 1) + n;
  },
  easeInCubic: function (e, t, n, r, i) {
    return r * (t /= i) * t * t + n;
  },
  easeOutCubic: function (e, t, n, r, i) {
    return r * ((t = t / i - 1) * t * t + 1) + n;
  },
  easeInOutCubic: function (e, t, n, r, i) {
    if ((t /= i / 2) < 1) return (r / 2) * t * t * t + n;
    return (r / 2) * ((t -= 2) * t * t + 2) + n;
  },
  easeInQuart: function (e, t, n, r, i) {
    return r * (t /= i) * t * t * t + n;
  },
  easeOutQuart: function (e, t, n, r, i) {
    return -r * ((t = t / i - 1) * t * t * t - 1) + n;
  },
  easeInOutQuart: function (e, t, n, r, i) {
    if ((t /= i / 2) < 1) return (r / 2) * t * t * t * t + n;
    return (-r / 2) * ((t -= 2) * t * t * t - 2) + n;
  },
  easeInQuint: function (e, t, n, r, i) {
    return r * (t /= i) * t * t * t * t + n;
  },
  easeOutQuint: function (e, t, n, r, i) {
    return r * ((t = t / i - 1) * t * t * t * t + 1) + n;
  },
  easeInOutQuint: function (e, t, n, r, i) {
    if ((t /= i / 2) < 1) return (r / 2) * t * t * t * t * t + n;
    return (r / 2) * ((t -= 2) * t * t * t * t + 2) + n;
  },
  easeInSine: function (e, t, n, r, i) {
    return -r * Math.cos((t / i) * (Math.PI / 2)) + r + n;
  },
  easeOutSine: function (e, t, n, r, i) {
    return r * Math.sin((t / i) * (Math.PI / 2)) + n;
  },
  easeInOutSine: function (e, t, n, r, i) {
    return (-r / 2) * (Math.cos((Math.PI * t) / i) - 1) + n;
  },
  easeInExpo: function (e, t, n, r, i) {
    return t == 0 ? n : r * Math.pow(2, 10 * (t / i - 1)) + n;
  },
  easeOutExpo: function (e, t, n, r, i) {
    return t == i ? n + r : r * (-Math.pow(2, (-10 * t) / i) + 1) + n;
  },
  easeInOutExpo: function (e, t, n, r, i) {
    if (t == 0) return n;
    if (t == i) return n + r;
    if ((t /= i / 2) < 1) return (r / 2) * Math.pow(2, 10 * (t - 1)) + n;
    return (r / 2) * (-Math.pow(2, -10 * --t) + 2) + n;
  },
  easeInCirc: function (e, t, n, r, i) {
    return -r * (Math.sqrt(1 - (t /= i) * t) - 1) + n;
  },
  easeOutCirc: function (e, t, n, r, i) {
    return r * Math.sqrt(1 - (t = t / i - 1) * t) + n;
  },
  easeInOutCirc: function (e, t, n, r, i) {
    if ((t /= i / 2) < 1) return (-r / 2) * (Math.sqrt(1 - t * t) - 1) + n;
    return (r / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + n;
  },
});
