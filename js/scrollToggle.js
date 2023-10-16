var ScrollToggle = function (obj, callbackShow, callbackHide) {
    this.ontop = 0;
    this.hontop = 0;
    this.obj= obj;
    this.top;
    this.bottom;
    this.oldy = 0;
    this.show = callbackShow;
    this.hide = callbackHide;
    this.threshold = $(window).height()/2;
    var self = this;



    (function () {

        var getWinPars = function(){ 
            self.winHeight = $(window).height();
            self.threshold = 0//(self.winHeight/6)*0;
        };
        
        self.top = obj.offset().top;

        self.bottom = obj.offset().top+obj.height();

        $(window).resize(function(){
           // console.log('set top');
           self.top = obj.offset().top;

           self.bottom = obj.offset().top+obj.height();

            getWinPars();
        });
        getWinPars();

        $(window).scroll(function (event) {
          // console.log('scroll '+self.top);
            var y = $(window).scrollTop() +self.winHeight;

            if(this.oldy>y &&  !$('html.scrollingup').length){
                $('html').addClass('scrollingup');
                // console.log('scrollingup');
            }
            else if(this.oldy<y && $('html.scrollingup').length){
                $('html').removeClass('scrollingup');
               // console.log('scrollingdown');
            }

         
            if (y >= (self.top + (self.winHeight -(self.winHeight/4))) && y <= (( self.bottom)-(self.winHeight/4))){
              //  console.log(self.innerHeight);
                self.ontop = 1;
            }else{
                self.ontop = 0;
              }
            if (self.ontop !== self.hontop) {
                if (self.ontop) {
                    self.show(obj);

                }
                else {
                    self.hide(obj);
                }
            }
            self.hontop = (self.ontop * 1);

            if(this.oldy != y){
                this.oldy= y;
            }
        });
    })();
};