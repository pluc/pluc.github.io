function selectNav() { jQuery(this).parents('#navMain:first').find('a').removeClass('selected').end().end().addClass('selected'); }

$.fn.konami = function() {
  var kkeys = [], el = $(this[0]), args = arguments[0] || {};
  $(document).keydown(function(e){
    kkeys.push(e.keyCode);
    if (kkeys.toString().indexOf("38,38,40,40,37,39,37,39,66,65") >= 0) {
      el.unbind('keydown', arguments.callee);
      $.getScript('/js/jquery.pong.js',function(){ $('#contentWrapper').empty().pong('/img/circle.gif',{ ballSpeed: 7, width: 558, height: 278, compSpeed: 10, playerSpeed: 10, paddleHeight: 50 })});
    }
  })
}
$('.content a').click(function(e){
  _gaq.push(['_trackEvent', 'Content', 'Click', 'URL', $(this).attr('href')]);
});

jQuery(document).ready(function($){
  $.easing.easeOutExpo = function (x, t, b, c, d) { return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b; };
  $.localScroll({ target: '#content', axis: 'x', duration:1000, hash: true, easing: 'easeOutExpo', onAfter: function() {selectNav.call($('#navMain').find('a[href$="' + window.location.hash.substr(1) + '"]').get(0))}});
  if (window.location.hash) selectNav.call($('#navMain').find('a[href$="' + window.location.hash.substr(1) + '"]').get(0));

  $(window).konami();

  $('#navMain a').click(function(){
    _gaq.push(['_trackPageview', $(this).attr('href')]);
  });

  $("#me").prettyPhoto({ show_title: false, allow_resize: false, social_tools: false, deeplinking: false, theme: 'dark_rounded', callback: function() {
    if (window.location.href.indexOf('#!prettyPhoto')) window.location.hash="about";
  }});

  $('form.userinput').validate({
    rules: { name: "required", message: "required", email: { required: true, email: true }, captcha: "required" },
    submitHandler: function(form) {
      $('#loader').toggle();
      $(form).toggle();
      $.ajax({type: 'POST', url: '/',
              data: $(form).serialize(),
              success: function(){
                $('#loader').toggle();
                $('#note').html("Thanks <em>"+$('#name').val()+"</em>, we'll be in touch.").fadeIn('slow');
                _gaq.push(['_trackEvent', 'Content', 'Contact', 'Result', 'true']);
              },
              error: function(){
                _gaq.push(['_trackEvent', 'Content', 'Contact', 'Result', 'false']);
              }
            });
    },
    showErrors: function(errorMap, errorList) {
      $.each(errorList, function(){
        _gaq.push(['_trackEvent', 'Content', 'Contact', 'Error', $(this.element).attr('id')+': '+$(this.element).val()]);
        $(this.element).parent('div.field').children().addClass('invalid');
      });
    }
  });
});