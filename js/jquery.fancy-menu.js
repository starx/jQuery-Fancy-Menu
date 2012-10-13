/*
 * jQuery Fancy Menu  v@1.0
 * http://projects.mrnepal.com/jquery/fancy-menu/
 * https://github.com/starx/jQuery-Fancy-Menu
 *
 * Copyright 2012 Nabin Nepal ~ St@rx
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Date: 2012-9-13
 */
(function($) {
	$.fn.fancyMenu = function(options){
		var settings = $.extend({
			'effects' : {
				'stair' : true,
				'transition' : true
			},
			'offset' : '1em',
			'mainColumn': 'auto',
			'mainColumnColor' : 'rgba(0,102,153,0.9)',
			'mainColumnShadow' : '0 0 10px 0px #666',
			'identifier' : {
				'containerClass' : 'fancyMenu',
				'currentColumn' : "curCol"
			}
		}, options);
		
		//console.log(settings);
		$elContainer = this;
		$el = this.find("ul.columns");
		$el.css('margin', settings.offset);
		$el.addClass(settings.identifier.containerClass);
		$columns = $el.children("li");
		console.log($columns);
		if(settings.mainColumn == 'auto') {
			$mainColumnIndex = Math.round(($columns.size())/2);
			$mainColumn = $columns.eq($mainColumnIndex-1);
		} else {
			$mainColumnIndex = settings.mainColumn;
			$mainColumn = $columns.eq($mainColumnIndex-1);
		}
		$curColumn = $("li."+settings.identifier.currentColumn, $el);
		$otherColumns = $("li:not(."+settings.identifier.currentColumn+")", $el);
		$allTitles = $("h2", $columns);

		$allAccordianTitles = $columns.find("ul.innerAccordian li h3");
		$allAccordianSections = $columns.find("ul.innerAccordian li div").hide();
		
		if(settings.effects.stair) {
			var adjustMargins = function($col) { 
				init = 5;                    
				$col.animate({marginTop: init+"%"});
				$col.nextAll().each(function(i) { $(this).animate({ marginTop: (init)+(5*(i+1))+"%" }); });
				$col.prevAll().each(function(i) { $(this).animate({ marginTop: (init)+(5*(i+1))+"%" }); });
			};
        } else { $columns.css('marginTop', '5%'); }
        
        //Transition
        console.log($elContainer.position());
		if(settings.effects.transition) {
			if($elContainer.find('.fancy-overlay').size() == 0) {
				$elContainer.prepend($("<div>", { 
					class: 'fancy-overlay', 
					css: { 
						height: $elContainer.outerHeight(),
						width: $elContainer.outerWidth(),
						display: 'block',
						position: 'absolute',
						zIndex: 0,
						background: '',						
						//border: '1px #000 solid',
						//margin: "-20px 0 0 -20px"
					} 
				}));	
			}	
		}
		
		var animateColumns = function($parentColumn, $parentColumnColor = null) {						
			var $curColumn = $("li.curCol", $el);
			//console.log($curColumn.size());
			console.log($('.expanded').size()+"--" + $('.expanding').size());
			// if not the first time
			if($curColumn.size()) {
				if(!$parentColumn.hasClass("curCol")) { //If current column is already active then dont do anything
					// In case the main image of the column is showing then slide this up					
					//console.log($curColumn);
					$('.expanding, li.curCol', $el).each(function() {
						
						$(".image", $(this)).slideUp();
						$curIndex = $(this).index()+1;
						$colorIndex = $curIndex > $mainColumnIndex ? (2*$mainColumnIndex)-$curIndex : $curIndex;
						var cValue = 255 - (($colorIndex - 1)*10);
						
						//resize previous column to normal size
						$(this).animate({
							width: "17.99%",
							backgroundColor: "rgba("+cValue+","+cValue+","+cValue+",0.8)",
							boxShadow: '0'
						}, 200, function() {
							//
							
						}); // finally remove the curent class indicator
					});
					animateMain($parentColumn, $parentColumnColor);
				}	
			} else {
				//if there are not current column then this is the first time it is being encountered					
				animateMain($parentColumn, $parentColumnColor);
				$(".image", $parentColumn).slideDown("slow", function() { 
				});
			}
				
		};
                
		var animateMain = function($parentColumn, $columnColor) {
			// Adjust the margin
			if(!$columnColor) { $columnColor = settings.mainColumnColor; }
			if(settings.effects.stair) adjustMargins($parentColumn);
			// make the current column the large size and the change background color  also add the current col to the list
			$parentColumn.addClass('expanding').delay(0).animate({				    
					backgroundColor: $columnColor,
					width: "28%"
			}, function() { 
				$("."+settings.identifier.currentColumn).removeClass(settings.identifier.currentColumn);
				$parentColumn.addClass(settings.identifier.currentColumn).removeClass('expanding').animate({ boxShadow: settings.mainColumnShadow }, 'fast');
			});
		};
                
		return $(this).each(function() {
			
			$("ul.innerAccordian", $columns).on("click", "li", function() {
			   if($(this).hasClass('active')) {
				   $(this).removeClass("active").children("div").slideUp("slow");
				   $(this).closest(".column").find(".image").slideDown().css("display", "block");
			   } else {
					$(".active").removeClass("active").children("div").slideUp("slow");
					$(this).closest(".column").find(".image").slideUp();
					$("div", $(this)).slideDown();
					$(this).addClass("active");
					var $parentColumn = $(this).parent().parent();
					animateColumns($parentColumn);
			   } 
			});
                        
			$otherColumns.on("click", "h2", function() {
				//$(this).parent().find("ul.innerAccordian li:first-of-type").trigger('click');
				
				if(settings.effects.transition) {
					var img = $.trim($(this).closest("li").data('transition-img'));
					if(img !== '') {
						$elContainer.css('backgroundImage', 'url("' + img + '")');
						$elContainer.find('.fancy-overlay').stop(false, true).fadeOut(1000, function() {
							$elContainer.find('.fancy-overlay').css('backgroundImage', 'url("' + img + '")');
							$elContainer.find('.fancy-overlay').fadeIn(0);
						});	
					}	
						
					var color = $.trim($(this).closest("li").data('transition-color'));
					if(color !== '') {
						$elContainer.css({
								'backgroundColor': color,
								'backgroundImage': ''
						});
						
						$elContainer.find('.fancy-overlay').stop(false, true).fadeOut(1000, function() {
							$elContainer.find('.fancy-overlay').css({
								'backgroundColor': color,
								'backgroundImage': ''
							});
							$elContainer.find('.fancy-overlay').fadeIn(0);
						});								
					}
			
				}				
				$(this).parent().children(".image").slideDown("slow").css({"display":"block"});				
				$("div", $('.active')).slideUp();
				
				/* Column Color */
				var columnColor = $.trim($(this).closest("li").data('column-color'));
				if(columnColor !== '') {
					animateColumns($(this).parent(), columnColor);
				} else {						
					animateColumns($(this).parent());
				}
			});

			$el.show();
			$("h2", $mainColumn).trigger('click');                                        
		});
                
	};    

})(jQuery);
