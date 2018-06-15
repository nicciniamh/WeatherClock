var deg = '&deg;';
var dsleep = 750;
var wupdate = 10000;
var cswap = 2500;

var owm = {
	places: undefined, // ['rockaway','tillamook','astoria','hood-river'],
	pindex: 0,
	_deftlocal: {'temp': -1, 'humi': -1, 'cond': 'nodata', 'name': 'no location', 'baro': 'Nodata', 'wind': 'sucks'},
	local: self._deftlocal,

  getplaces: function() {
    if (this.places != undefined)
      return
   $.ajax({
        url      : 'places.php',
        dataType : 'json',
        context  : this,
        success : function(d,st,x) { 
          if (st == 'success') {
            this.places = d;
            owm.getWeather();
          } else
            console.log('Invalid data returned!',st,d)
        }
    });

  },
	place: function _place() {
    self = this;
    place = self.places[self.pindex];
    if (place == undefined) {
      self.pindex = 0;
      place = self.places[self.pindex]; 
    }
		self.pindex = self.pindex + 1;
		return place;
	},
	getWeather: function(instance) {
    self = instance || this;
    url = 'owmdata.php?'+self.place(),
     $.ajax({
          url      : url,
	        dataType : 'json',
	        context  : self,
	        success : function(d,st,x) { 
            if (st == 'success')
              this.local = d;
            else
              console.log('Invalid data returned!',st,d)
          }
	    });
	},
}
function setCond() {$('#weatherCondition').html(owm.local.temp+deg+', '+owm.local.humi+'%, '+owm.local.wind);};
function setTimes() {$('#weatherCondition').html('Updated '+owm.local.datatime);}
var flipper = [setCond,setTimes];
var flipflop = 0;

function setWeatherCond() {
  if(owm.local != undefined)
    flipper[flipflop++&1]()
  setTimeout(setWeatherCond,cswap);
}
function tick() {
	var dt = new Date();
	var t = dt.toTimeString().split(' ')[0];
  var t = strftime('%l:%M:%S%P')
	$('#clock').html(t)
	$('#weatherLocation').html(owm.local.name)
	$('#weatherDescription').html(owm.local.cond)
  $('#weatherIcon').attr({
    src: 'http://openweathermap.org/img/w/'+owm.local.icon+'.png'
  })
  var alr = {
    'tlow1':  new range(-40,60),
    'tlow2':  new range(61,64),
    'tok':    new range(65,70),
    'thigh1': new range(71,75),
    'thigh2': new range(76,200)
  }
    $.ajax({
        url : 'wdata.php',
        dataType : 'json',
        context : this,
        success : function(td) {
          classIn = 'tok'
          t = parseInt(td.tf)
          h = parseInt(td.h)
          Object.keys(alr).forEach(function(k) { if (alr[k].in(t)) classIn = k; });
          dstr = owm.local.baro+', '+t+deg+', '+h+'%';
          $('#indoor').html(dstr);
          ['tlow1','tlow2','tok','thigh1','thigh2'].forEach(function(c) { $('#indoor').removeClass(c); });
          $('#indoor').addClass(classIn);
    }
    });
}
$().ready(function() {
  owm.getplaces()
  setInterval(tick,dsleep);
  setInterval(function() {
    owm.getWeather(owm);
  },wupdate);
  setWeatherCond();
});
