/*!
 * windowLay.js
 * (c) 2010-2022 bobliao
 * Released under the MIT License.
 */
import './index.css';
import mouseControl from '@bobliao/mouse-controller';
import useJquery from '@bobliao/use-jquery-hook';
const $ = useJquery();

var _windowLay = function(_config) {
  var self = this;
  this.screenState = 'H';
  //判断是否为移动端
  self.isMobile = false;
  // 检测userAgent来判断是否为移动端
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    self.isMobile = true;
  }

  self.getScreenState = function() {
    if (self.isMobile) {
      //竖屏
      if (window.orientation === 180 || window.orientation === 0) {
        self.screenState = 'V';
      }
      //横屏
      if (window.orientation === 90 || window.orientation === -90) {
        self.screenState = 'H';
      }
    }
  };
  self.getScreenState();

  //请求样式

  var config = {
    //标题
    title: 'No Title',
    //内容
    content: '<div>Default Content</div>',
    //放置的容器
    container: 'body',
    //位置
    position: {
      x: 'conter',
      y: 'conter',
    },
    //大小
    size: {
      width: 450,
      height: 'auto',
    },
    //按钮设置
    buttons: {
      //none为没有按钮
      //yes为只有确认键
      //yesno为确定和取消
      //free为自定义
      mode: 'none',
      yesCall: function() {},
      noCall: function() {},
      yesText: 'yes',
      noText: 'no',
      arr: [],
    },
    //是否加入背景
    background: {
      enabled: true,
      //是否点击空白处关闭
      bgClose: false,
    },
    style: '',
    classAdd: '',
    //关闭回调
    closeCall: function() {},
    //是否不显示关闭按钮
    isNoCloseBtn: false,
    //是否不显示标题
    isNoTitle: false,
  };

  this.config = $.extend(true, config, _config);

  //打开窗口
  this.open = function(_callBack) {
    //创建主结构
    self.createMainPanel();
    //创建内容
    self.createContent();
    //重定位
    self.resize();
    //绑定事件
    self.bindEvent();
    $(window).resize(self.resize);
    try {
      window.addEventListener('touchmove', self.resize, { passive: false });
    } catch (_e) {}
    if (typeof _callBack !== 'undefined') {
      _callBack();
    }
  };

  //绑定事件
  this.bindEvent = function() {
    //鼠标按下
    this.titleText.mousedown(function() {
      var bP = {
        x: mouseControl.nowPosition.x - self.content.offset().left,
        y: mouseControl.nowPosition.y - self.content.offset().top,
      };
      //鼠标移动
      mouseControl.addMouseMoveFunc('windowMove', function() {
        var p = {
          x: mouseControl.nowPosition.x - bP.x,
          y: mouseControl.nowPosition.y - bP.y - $(window).scrollTop(),
        };
        if (self.checkBorder(p, 'y')) {
          self.content.css('top', p.y + 'px');
        }
        if (self.checkBorder(p, 'x')) {
          self.content.css('left', p.x + 'px');
        }
      });

      //鼠标弹起
      mouseControl.addMouseUpFunc('windowUp', function() {
        mouseControl.removeMMRFunc('windowMove');
        mouseControl.removeMURFunc('windowUp');
      });
    });

    this.closeBtn.mousedown(function(e) {
      e.stopPropagation();
    });

    //关闭窗口
    this.closeBtn.click(function() {
      self.close();
    });

    if (self.config.isNoCloseBtn === true) {
      this.closeBtn.hide();
    }

    if (self.config.isNoTitle === true) {
      this.title.hide();
    }

    if (
      self.config.buttons.mode !== 'none' &&
      self.config.buttons.mode !== 'free'
    ) {
      self.buttonYes.click(function() {
        self.config.buttons.yesCall();
        self.close();
      });
      if (self.config.buttons.mode === 'yesno') {
        self.buttonCancle.click(function() {
          self.config.buttons.noCall();
          self.close();
        });
      }
    }

    if (this.config.background.bgClose === true) {
      this.background.click(function() {
        self.close();
      });
    }
  };

  //检查边缘
  this.checkBorder = function(_position, _dir) {
    var feedBack = true;
    if (_dir === 'x') {
      if (_position.x <= 0) {
        self.content.css('left', '0px');
        feedBack = false;
      }
      if (_position.x + self.content.width() > $(window).width()) {
        self.content.css(
          'left',
          $(window).width() - self.content.width() + 'px'
        );
        feedBack = false;
      }
    } else {
      if (_position.y <= 0) {
        self.content.css('top', '0px');
        feedBack = false;
      }
      if (_position.y + self.content.height() > $(window).height()) {
        self.content.css(
          'top',
          $(window).height() - self.content.height() + 'px'
        );
        feedBack = false;
      }
    }
    return feedBack;
  };

  //创建主结构
  this.createMainPanel = function() {
    this.background = $("<div class='b-window-background' ></div>").appendTo(
      self.config.container
    );
    this.content = $(`	<div class='b-ballWindow' > 
								<div class='b-title' >
									<label class='b-title-close' ></label>
								</div>
								<div class="title-line" >这是标题</div>
								<div class='b-window-container' >
								</div>
							</div>`).appendTo(self.config.container);
    this.title = this.content.find('.b-title');
    this.contentContainer = this.content.find('.b-window-container');
    this.closeBtn = this.content.find('.b-title > label');
    this.titleText = this.content.find('.title-line');
    this.background.css('opacity', '0');
    this.content.css('opacity', '0');
    if (self.config.style !== '') {
      this.contentContainer.attr('style', self.config.style);
    }
    if (self.config.classAdd !== '') {
      this.contentContainer.addClass(self.config.classAdd);
      this.content.addClass(self.config.classAdd);
    }

    //创建按钮
    this.createButtons();
    if (this.config.background.enabled === false) {
      this.background.hide();
    }
  };

  //创建按钮
  this.createButtons = function() {
    if (
      self.config.buttons.mode !== 'none' &&
      self.config.buttons.mode !== 'free'
    ) {
      self.buttonContainer = $(
        "<div class='b-w-buttonContainer' ></div>"
      ).appendTo(self.content);
      if (self.config.buttons.mode === 'yes') {
        self.buttonYes = $(
          "<button class='b-w-b n-button' >" +
            self.config.buttons.yesText +
            '</button>'
        ).appendTo(self.buttonContainer);
      }

      if (self.config.buttons.mode === 'yesno') {
        self.buttonCancle = $(
          "<button class='b-w-b n-button'  >" +
            self.config.buttons.noText +
            '</button>&nbsp;&nbsp;'
        ).appendTo(self.buttonContainer);
        self.buttonYes = $(
          "<button class='b-w-b n-button' >" +
            self.config.buttons.yesText +
            '</button>'
        ).appendTo(self.buttonContainer);
        if (self.screenState !== 'V') {
          self.buttonYes.addClass('lastButton');
        }
        self.buttonCancle.addClass('noButton');
      }
      self.buttonYes.focus();
    }

    if (self.config.buttons.mode === 'free') {
      self.buttonContainer = $(
        "<div class='b-w-buttonContainer' ></div>"
      ).appendTo(self.content);
      for (var i = 0; i < self.config.buttons.arr.length; i++) {
        var item = self.config.buttons.arr[i];
        var elem = $(
          "<button class='b-w-b n-button'  >" +
            item.name +
            '</button>&nbsp;&nbsp;'
        ).appendTo(self.buttonContainer);
        if (self.screenState === 'V') {
          elem.css('width', 100 / self.config.buttons.arr.length + '%');
        }
        if (i !== self.config.buttons.arr.length - 1) {
          elem.addClass('lastButton');
        }
        (function(_item, _elem) {
          _elem.click(function() {
            _item.callBack();
          });
        })(item, elem);
      }
    }
  };

  //创建内容
  this.createContent = function() {
    $(self.config.content).appendTo(self.contentContainer);
    if (self.config.title === '') {
      this.titleText.hide();
    } else {
      this.titleText.html(self.config.title);
    }

    if (self.config.position.x === 'tips') {
      if (self.config.size.width !== 'auto') {
        self.content.width(self.config.size.width / 14 + 'rem');
      }
      if (self.config.size.height !== 'auto') {
        self.contentContainer.height(self.config.size.height / 14 + 'rem');
      }
      self.background.hide();
      self.content.css(
        'top',
        $(window).height() - self.content.height() + 'px'
      );
      self.content.css('left', $(window).width());
      self.contentContainer.css('background-color', '#e8ecdc');
      self.content.css('box-shadow', '0px 0px 400px rgba(0,0,0,0.2)');
      self.content.animate(
        { left: $(window).width() - self.content.outerWidth(), opacity: 1 },
        {
          duration: 500,
          easing: 'easeOutQuart',
        }
      );
    } else {
      if (self.screenState === 'V') {
        self.background.animate({ opacity: 0.45 }, 200);
        self.content.animate({ opacity: 1 }, 350);
      } else {
        $({ opacity: 0, bkd: 0 }).animate(
          { opacity: 1, bkd: 2 },
          {
            duration: 200,
            easing: 'easeOutQuart',
            progress: function() {
              self.background.css('opacity', this.opacity);
              self.background.css(
                'backdrop-filter',
                'blur(' + this.bkd + 'px)'
              );
            },
            complete: function() {
              self.background.css('opacity', this.opacity);
              self.background.css(
                'backdrop-filter',
                'blur(' + this.bkd + 'px)'
              );
            },
          }
        );
        //self.background.animate({ opacity: 1 }, 200);
        //self.content.animate({ opacity: 1 }, 350);
        self.content.css('transform-origin', 'center center');
        self.content.css('perspective', '500px');
        self.content.css('transform', 'scaleZ(-20deg)');
        $({ rotateZ: 20, opacity: 0, scale: 0.95 }).animate(
          { rotateZ: 0, opacity: 1, scale: 1 },
          {
            duration: 500,
            easing: 'easeOutQuart',
            progress: function() {
              self.content.css(
                'transform',
                'rotateY(' + this.rotateZ + 'deg) scale(' + this.scale + ')'
              );
              self.content.css('opacity', this.opacity);
            },
            complete: function() {
              self.content.css(
                'transform',
                'rotateY(' + this.rotateZ + 'deg) scale(' + this.scale + ')'
              );
              self.content.css('opacity', this.opacity);
              self.content.css('transform-origin', '');
              self.content.css('perspective', '');
              self.content.css('transform', '');
            },
          }
        );
      }
    }
  };

  //重定位
  this.resize = function() {
    self.getScreenState();
    if (self.config.size.width !== 'auto') {
      self.content.width(self.config.size.width / 14 + 'rem');
    }
    if (self.config.size.height !== 'auto') {
      self.contentContainer.height(self.config.size.height / 14 + 'rem');
    }
    if (self.config.position.x === 'tips') {
      self.content.css(
        'top',
        $(window).height() - self.content.height() + 'px'
      );
      self.content.css('left', $(window).width() - self.content.width() + 'px');
    } else {
      if (config.position.y === 'center') {
        self.content.css(
          'top',
          $(window).height() / 2 - self.content.height() / 2
        );
      } else {
        self.content.css('top', self.config.position.y);
      }

      if (self.config.position.x === 'center') {
        self.content.css(
          'left',
          $(window).width() / 2 - self.content.width() / 2
        );
      } else {
        self.content.css('left', self.config.position.x);
      }
    }
    if (self.screenState === 'V') {
      if (self.config.buttons.mode === 'yesno') {
        self.buttonCancle.css('width', '50%');
        self.buttonYes.css('width', '50%');
        self.buttonYes.addClass('lastOne');
      }
    } else {
      if (self.config.buttons.mode === 'yesno') {
        //self.buttonCancle.css("margin-left", "50px");
      }
    }
    //self.background.height($(window).height());
  };

  //关闭窗口
  this.close = function() {
    this.background.animate({ opacity: 0 }, 200);

    $({ rotateZ: 0, opacity: 1, scale: 1 }).animate(
      { rotateZ: 20, opacity: 0, scale: 0.95 },
      {
        duration: 350,
        easing: 'easeOutQuart',
        progress: function() {
          self.content.css(
            'transform',
            'rotateY(' + this.rotateZ + 'deg) scale(' + this.scale + ')'
          );
          self.content.css('opacity', this.opacity);
        },
        complete: function() {
          self.content.css(
            'transform',
            'rotateY(' + this.rotateZ + 'deg) scale(' + this.scale + ')'
          );
          self.content.css('opacity', this.opacity);

          self.content.remove();
          self.background.remove();
          self.config.closeCall();
          $(window).unbind('resize', self.resize);
          try {
            window.removeEventListener('touchmove', self.resize);
          } catch (_e) {}
        },
      }
    );
  };
};

export default _windowLay;
